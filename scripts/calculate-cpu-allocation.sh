#!/bin/bash

# Script để tính toán phân bổ CPU tự động dựa trên số cores thực tế

# Lấy số cores thực tế
TOTAL_CORES=$(nproc)

echo "=========================================="
echo "CPU Resource Allocation Calculator"
echo "=========================================="
echo "Tổng số cores: $TOTAL_CORES"
echo ""

# Tính toán phân bổ (tỷ lệ: E-Learning 37.5%, CRM 37.5%, Admin 12.5%, API 12.5%)
ELEARNING_CORES=$(echo "$TOTAL_CORES * 0.375" | bc | xargs printf "%.1f")
CRM_CORES=$(echo "$TOTAL_CORES * 0.375" | bc | xargs printf "%.1f")
ADMIN_CORES=$(echo "$TOTAL_CORES * 0.125" | bc | xargs printf "%.1f")
API_CORES=$(echo "$TOTAL_CORES * 0.125" | bc | xargs printf "%.1f")

echo "Phân bổ đề xuất:"
echo "  E-Learning Portal: $ELEARNING_CORES cores (37.5%)"
echo "  CRM Portal:        $CRM_CORES cores (37.5%)"
echo "  Admin Portal:      $ADMIN_CORES cores (12.5%)"
echo "  API Server:        $API_CORES cores (12.5%)"
echo ""

# Tạo cấu hình cho docker-compose.yml
echo "Cấu hình cho docker-compose.yml:"
echo ""
echo "  elearning:"
echo "    cpus: '$ELEARNING_CORES'"
echo "    cpu_shares: 1024"
echo ""
echo "  crm:"
echo "    cpus: '$CRM_CORES'"
echo "    cpu_shares: 1024"
echo ""
echo "  admin:"
echo "    cpus: '$ADMIN_CORES'"
echo "    cpu_shares: 512"
echo ""
echo "  api:"
echo "    cpus: '$API_CORES'"
echo "    cpu_shares: 512"
echo ""

# Cảnh báo nếu số cores quá ít
if [ "$TOTAL_CORES" -lt 4 ]; then
  echo "⚠️  CẢNH BÁO: Server có ít hơn 4 cores, có thể ảnh hưởng đến hiệu năng!"
  echo "   Khuyến nghị tối thiểu: 4 cores"
fi

