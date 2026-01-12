#!/usr/bin/env node

/**
 * Script để tự động cập nhật phân bổ CPU trong docker-compose.yml
 * dựa trên số cores thực tế của server
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Lấy số cores thực tế
function getTotalCores() {
  try {
    // Thử dùng nproc (Linux)
    const cores = execSync('nproc', { encoding: 'utf-8' }).trim();
    return parseInt(cores, 10);
  } catch (error) {
    try {
      // Fallback: đọc từ /proc/cpuinfo (Linux)
      const cpuinfo = fs.readFileSync('/proc/cpuinfo', 'utf-8');
      const matches = cpuinfo.match(/^processor\s+:\s+\d+/gm);
      return matches ? matches.length : 8; // Default 8 nếu không tìm thấy
    } catch (e) {
      // Nếu không phải Linux, dùng giá trị mặc định hoặc từ argument
      const coresFromArg = process.argv[2];
      if (coresFromArg) {
        return parseInt(coresFromArg, 10);
      }
      console.warn('⚠️  Không thể tự động detect số cores, sử dụng giá trị mặc định: 8');
      console.warn('   Bạn có thể truyền số cores thủ công: node scripts/update-cpu-allocation.js <số_cores>');
      return 8;
    }
  }
}

// Tính toán phân bổ CPU
function calculateAllocation(totalCores) {
  // Tính toán chính xác trước
  const elearning = totalCores * 0.375;
  const crm = totalCores * 0.375;
  const admin = totalCores * 0.125;
  const api = totalCores * 0.125;
  
  // Làm tròn đến 1 chữ số thập phân
  let elearningRounded = parseFloat(elearning.toFixed(1));
  let crmRounded = parseFloat(crm.toFixed(1));
  let adminRounded = parseFloat(admin.toFixed(1));
  let apiRounded = parseFloat(api.toFixed(1));
  
  // Kiểm tra tổng có vượt quá totalCores không
  let total = elearningRounded + crmRounded + adminRounded + apiRounded;
  
  // Nếu tổng vượt quá, scale down để đảm bảo tổng = totalCores
  if (total > totalCores) {
    const scale = totalCores / total;
    elearningRounded = parseFloat((elearningRounded * scale).toFixed(1));
    crmRounded = parseFloat((crmRounded * scale).toFixed(1));
    adminRounded = parseFloat((adminRounded * scale).toFixed(1));
    apiRounded = parseFloat((apiRounded * scale).toFixed(1));
  }
  
  // Đảm bảo tất cả giá trị >= 0.1 (minimum cho Docker)
  elearningRounded = Math.max(0.1, elearningRounded);
  crmRounded = Math.max(0.1, crmRounded);
  adminRounded = Math.max(0.1, adminRounded);
  apiRounded = Math.max(0.1, apiRounded);
  
  // Kiểm tra lại tổng cuối cùng và điều chỉnh nếu cần
  total = elearningRounded + crmRounded + adminRounded + apiRounded;
  if (total > totalCores) {
    // Scale down một lần nữa
    const scale = totalCores / total;
    elearningRounded = parseFloat((elearningRounded * scale).toFixed(1));
    crmRounded = parseFloat((crmRounded * scale).toFixed(1));
    adminRounded = parseFloat((adminRounded * scale).toFixed(1));
    apiRounded = parseFloat((apiRounded * scale).toFixed(1));
  }
  
  return {
    elearning: elearningRounded,
    crm: crmRounded,
    admin: adminRounded,
    api: apiRounded,
  };
}

// Cập nhật file docker-compose.yml
function updateDockerCompose(filePath, allocation) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  let inApi = false;
  let inAdmin = false;
  let inCrm = false;
  let inElearning = false;
  
  const updatedLines = lines.map((line, index) => {
    // Detect service block
    if (line.match(/^\s+api:/)) {
      inApi = true;
      inAdmin = false;
      inCrm = false;
      inElearning = false;
    } else if (line.match(/^\s+admin:/)) {
      inApi = false;
      inAdmin = true;
      inCrm = false;
      inElearning = false;
    } else if (line.match(/^\s+crm:/)) {
      inApi = false;
      inAdmin = false;
      inCrm = true;
      inElearning = false;
    } else if (line.match(/^\s+elearning:/)) {
      inApi = false;
      inAdmin = false;
      inCrm = false;
      inElearning = true;
    } else if (line.match(/^\s+\w+:/) && !line.match(/^\s+(api|admin|crm|elearning):/)) {
      // Reset flags when entering a new service
      inApi = false;
      inAdmin = false;
      inCrm = false;
      inElearning = false;
    }
    
    // Update cpus line
    if (line.match(/cpus:\s*['"][\d.]+['"]/)) {
      if (inApi) {
        return line.replace(/cpus:\s*['"][\d.]+['"]/, `cpus: '${allocation.api}'`);
      } else if (inAdmin) {
        return line.replace(/cpus:\s*['"][\d.]+['"]/, `cpus: '${allocation.admin}'`);
      } else if (inCrm) {
        return line.replace(/cpus:\s*['"][\d.]+['"]/, `cpus: '${allocation.crm}'`);
      } else if (inElearning) {
        return line.replace(/cpus:\s*['"][\d.]+['"]/, `cpus: '${allocation.elearning}'`);
      }
    }
    
    return line;
  });
  
  fs.writeFileSync(filePath, updatedLines.join('\n'), 'utf-8');
  console.log(`✅ Đã cập nhật ${path.basename(filePath)}`);
}

// Main function
function main() {
  const totalCores = getTotalCores();
  const allocation = calculateAllocation(totalCores);
  
  console.log('==========================================');
  console.log('CPU Resource Allocation Calculator');
  console.log('==========================================');
  console.log(`Tổng số cores: ${totalCores}`);
  console.log('');
  console.log('Phân bổ đề xuất:');
  console.log(`  E-Learning Portal: ${allocation.elearning} cores (37.5%)`);
  console.log(`  CRM Portal:        ${allocation.crm} cores (37.5%)`);
  console.log(`  Admin Portal:      ${allocation.admin} cores (12.5%)`);
  console.log(`  API Server:        ${allocation.api} cores (12.5%)`);
  const totalAllocated = allocation.elearning + allocation.crm + allocation.admin + allocation.api;
  console.log(`  Tổng phân bổ:      ${totalAllocated.toFixed(2)} cores (${((totalAllocated / totalCores) * 100).toFixed(1)}%)`);
  console.log('');
  
  // Đường dẫn đến các file docker-compose
  const rootDir = path.join(__dirname, '..');
  const composeDev = path.join(rootDir, 'docker-compose.yml');
  const composeProd = path.join(rootDir, 'docker-compose.prod.yml');
  
  // Cập nhật các file
  if (fs.existsSync(composeDev)) {
    updateDockerCompose(composeDev, allocation);
  }
  
  if (fs.existsSync(composeProd)) {
    updateDockerCompose(composeProd, allocation);
  }
  
  console.log('');
  console.log('✅ Hoàn thành! Đã cập nhật phân bổ CPU.');
  console.log('');
  console.log('Lưu ý: Thay đổi sẽ được áp dụng khi chạy docker-compose up -d');
}

main();

