import type { Request, Response } from 'express';
import { sendError, sendSuccess } from '@libs/response';
import { MongoDbTicketComments } from '@mongodb/ticket-comments';
import { MongoDbTickets } from '@mongodb/tickets';
import FileValidator from '@services/fileValidator';
import { getIO } from '../../../socket';

/**
 * Ticket Comment Controller
 * Handles ticket comment/reply operations
 */
class TicketCommentController {
  /**
   * GET /api/a/tickets/:ticketId/comments
   * Get all comments for a ticket
   */
  async getComments(req: Request, res: Response) {
    try {
      const { ticketId } = req.params;

      // Check if ticket exists
      const ticket = await MongoDbTickets.model.findById(ticketId);
      if (!ticket) {
        return sendError(res, 404, 'Ticket not found');
      }

      // Get all comments for this ticket
      const comments = await MongoDbTicketComments.model
        .find({ ticketId })
        .populate('userId', 'fullname email')
        .populate('adminId', 'fullname email avatar')
        .sort({ createdAt: 1 }) // Oldest first
        .lean();

      console.log(`📝 Found ${comments.length} comments for ticket ${ticketId}`);

      sendSuccess(res, { comments });
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * POST /api/a/tickets/:ticketId/comments
   * Add a comment/reply to a ticket
   * Supports multipart/form-data with file uploads
   */
  async addComment(req: Request, res: Response) {
    try {
      const { ticketId } = req.params;
      const { content } = req.body;

      if (!content || !content.trim()) {
        return sendError(res, 400, 'Comment content is required');
      }

      // Check if ticket exists
      const ticket = await MongoDbTickets.model.findById(ticketId);
      if (!ticket) {
        return sendError(res, 404, 'Ticket not found');
      }

      // Get current user (admin)
      const currentUser = req.user as any;
      if (!currentUser) {
        return sendError(res, 401, 'Unauthorized');
      }

      // Handle file uploads if present
      let attachments: Array<{ filename: string; url: string; uploadedAt: string }> = [];
      const files = req.files as Express.Multer.File[] | undefined;
      
      if (files && files.length > 0) {
        const MinioService = require('@services/minio').default;
        
        for (const file of files) {
          try {
            // Validate file by magic bytes to prevent malicious file extension spoofing
            const validation = FileValidator.validateFileByMagicBytes(file.buffer, file.mimetype);
            if (!validation.isValid) {
              console.error(`⚠️ [Ticket Comment File Validation] File ${file.originalname} failed validation:`, validation.error);
              // Skip this file and continue with others
              continue;
            }

            // Upload to MinIO
            const folder = 'ticket-comments';
            const filePath = await MinioService.uploadFile(file.buffer, file.originalname, file.mimetype, folder);
            const url = MinioService.getPublicUrl(filePath);
            
            attachments.push({
              filename: file.originalname,
              url: url,
              uploadedAt: new Date().toISOString(),
            });
          } catch (uploadError: any) {
            console.error('Error uploading file:', file.originalname, uploadError);
            // Continue with other files even if one fails
          }
        }
      } else if (req.body.attachments) {
        // Support JSON attachments (for backward compatibility)
        try {
          attachments = typeof req.body.attachments === 'string' 
            ? JSON.parse(req.body.attachments) 
            : req.body.attachments;
        } catch (e) {
          // Ignore parse errors
        }
      }

      // Create comment
      const comment = await MongoDbTicketComments.model.create({
        ticketId,
        adminId: currentUser._id,
        content: content.trim(),
        isAdmin: true,
        attachments: attachments,
      });

      // Update ticket status to "in_progress" if it's still "open" or "pending"
      if (ticket.status === 'open' || ticket.status === 'pending') {
        await MongoDbTickets.model.findByIdAndUpdate(ticketId, {
          status: 'in_progress',
        });
      }

      // Populate comment with admin details
      const populatedComment = await MongoDbTicketComments.model
        .findById(comment._id)
        .populate('adminId', 'fullname email avatar')
        .lean();

      console.log('✅ Created comment:', populatedComment?._id);

      // Emit realtime event đến room ticket (user + admin cùng room nhận)
      // Dùng ticket._id để đảm bảo trùng format với API GET ticket (client join bằng id này)
      try {
        const io = getIO();
        const idStr = String((ticket as any)._id ?? ticketId);
        const roomId = `ticket:${idStr}`;
        io.of('/tickets')
          .to(roomId)
          .emit('ticket:comment:new', {
            ticketId: idStr,
            comment: populatedComment,
          });
      } catch {
        // Socket server chưa khởi tạo - bỏ qua
      }

      sendSuccess(res, { comment: populatedComment }, 'Comment added successfully');
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }

  /**
   * DELETE /api/a/tickets/:ticketId/comments/:commentId
   * Delete a comment
   */
  async deleteComment(req: Request, res: Response) {
    try {
      const { ticketId, commentId } = req.params;

      // Check if ticket exists
      const ticket = await MongoDbTickets.model.findById(ticketId);
      if (!ticket) {
        return sendError(res, 404, 'Ticket not found');
      }

      // Check if comment exists
      const comment = await MongoDbTicketComments.model.findById(commentId);
      if (!comment) {
        return sendError(res, 404, 'Comment not found');
      }

      // Check if user has permission (admin or comment owner)
      const currentUser = req.user as any;
      if (!currentUser) {
        return sendError(res, 401, 'Unauthorized');
      }

      // Only allow deletion if user is admin/manager or comment owner
      const isOwner = comment.adminId?.toString() === currentUser._id.toString();
      const userRole = currentUser.role;
      if (!isOwner && userRole !== 'admin' && userRole !== 'manager') {
        return sendError(res, 403, 'You do not have permission to delete this comment');
      }

      // Delete comment
      await MongoDbTicketComments.model.findByIdAndDelete(commentId);

      sendSuccess(res, {}, 'Comment deleted successfully');
    } catch (error: any) {
      sendError(res, 500, error.message, error as Error);
    }
  }
}

export default new TicketCommentController();

