import { Router } from 'express';
import LeadController from '@controllers/api/admin/LeadController';

const router = Router();

// Get all leads
router.get('/', LeadController.getAllLeads);

// Get lead statistics
router.get('/stats', LeadController.getLeadStats);

// Get lead by ID
router.get('/:id', LeadController.getLeadById);

// Update lead status
router.put('/:id/status', LeadController.updateLeadStatus);

// Delete lead
router.delete('/:id', LeadController.deleteLead);

export default router;

