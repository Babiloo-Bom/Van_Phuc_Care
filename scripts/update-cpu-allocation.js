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
  // Ưu tiên đọc từ /proc/cpuinfo (nhanh hơn và không cần exec)
  try {
    const cpuinfo = fs.readFileSync('/proc/cpuinfo', 'utf-8');
    const matches = cpuinfo.match(/^processor\s+:\s+\d+/gm);
    if (matches && matches.length > 0) {
      return matches.length;
    }
  } catch (e) {
    // Ignore error, try next method
  }
  
  // Fallback: dùng nproc (Linux)
  try {
    const cores = execSync('nproc', { 
      encoding: 'utf-8',
      maxBuffer: 1024
    }).trim();
    const parsed = parseInt(cores, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  } catch (error) {
    // Ignore error, try next method
  }
  
  // Nếu không phải Linux hoặc không detect được, dùng giá trị mặc định hoặc từ argument
  const coresFromArg = process.argv[2];
  if (coresFromArg) {
    const parsed = parseInt(coresFromArg, 10);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
  }
  
  console.warn('⚠️  Không thể tự động detect số cores, sử dụng giá trị mặc định: 2');
  console.warn('   Bạn có thể truyền số cores thủ công: node scripts/update-cpu-allocation.js <số_cores>');
  return 2; // Default 2 cores (phù hợp với server hiện tại)
}

// Tính toán phân bổ CPU
function calculateAllocation(totalCores) {
  // Dành CPU cho các service khác (mongodb, minio, redis)
  // Mỗi service cần khoảng 0.1 cores
  const mongodbCpu = 0.1;
  const minioCpu = 0.1;
  const redisCpu = 0.1;
  const otherServicesTotal = mongodbCpu + minioCpu + redisCpu; // 0.3 cores
  
  // CPU còn lại cho các service chính (api, admin, crm, elearning)
  const availableCores = totalCores - otherServicesTotal;
  
  // Tính toán phân bổ cho các service chính dựa trên availableCores
  const elearning = availableCores * 0.375;
  const crm = availableCores * 0.375;
  const admin = availableCores * 0.125;
  const api = availableCores * 0.125;
  
  // Làm tròn xuống đến 1 chữ số thập phân để đảm bảo không vượt quá
  let elearningRounded = Math.floor(elearning * 10) / 10;
  let crmRounded = Math.floor(crm * 10) / 10;
  let adminRounded = Math.floor(admin * 10) / 10;
  let apiRounded = Math.floor(api * 10) / 10;
  
  // Đảm bảo tất cả giá trị >= 0.1 (minimum cho Docker)
  elearningRounded = Math.max(0.1, elearningRounded);
  crmRounded = Math.max(0.1, crmRounded);
  adminRounded = Math.max(0.1, adminRounded);
  apiRounded = Math.max(0.1, apiRounded);
  
  // Tính tổng sau khi làm tròn xuống
  let total = elearningRounded + crmRounded + adminRounded + apiRounded;
  let remaining = parseFloat((availableCores - total).toFixed(1)); // Dùng availableCores, không phải totalCores
  
  // Phân bổ phần còn lại cho các service ưu tiên (elearning và crm)
  // Mỗi lần thêm 0.1 cores, đảm bảo không vượt quá availableCores
  if (remaining >= 0.2) {
    elearningRounded = parseFloat((elearningRounded + 0.1).toFixed(1));
    crmRounded = parseFloat((crmRounded + 0.1).toFixed(1));
    remaining = parseFloat((remaining - 0.2).toFixed(1));
  } else if (remaining >= 0.1) {
    elearningRounded = parseFloat((elearningRounded + 0.1).toFixed(1));
    remaining = parseFloat((remaining - 0.1).toFixed(1));
  }
  
  // Kiểm tra lại tổng cuối cùng - đảm bảo không vượt quá availableCores
  total = parseFloat((elearningRounded + crmRounded + adminRounded + apiRounded).toFixed(1));
  
  // Nếu vẫn vượt quá availableCores (do làm tròn), giảm từ service lớn nhất
  if (total > availableCores) {
    const excess = parseFloat((total - availableCores).toFixed(1));
    // Giảm từ service có giá trị lớn nhất
    if (elearningRounded >= crmRounded && elearningRounded > 0.1) {
      elearningRounded = Math.max(0.1, parseFloat((elearningRounded - excess).toFixed(1)));
    } else if (crmRounded > 0.1) {
      crmRounded = Math.max(0.1, parseFloat((crmRounded - excess).toFixed(1)));
    } else if (adminRounded > 0.1) {
      adminRounded = Math.max(0.1, parseFloat((adminRounded - excess).toFixed(1)));
    } else if (apiRounded > 0.1) {
      apiRounded = Math.max(0.1, parseFloat((apiRounded - excess).toFixed(1)));
    }
  }
  
  // Kiểm tra lại tổng cuối cùng - đảm bảo tổng tất cả services < totalCores với buffer lớn hơn
  total = parseFloat((elearningRounded + crmRounded + adminRounded + apiRounded).toFixed(2));
  let totalAllServices = total + otherServicesTotal;
  const maxAllowed = totalCores - 0.2; // Buffer 0.2 để tránh lỗi làm tròn và đảm bảo an toàn
  
  // Nếu tổng tất cả services >= maxAllowed, giảm từ service lớn nhất cho đến khi < maxAllowed
  while (totalAllServices >= maxAllowed) {
    const excess = totalAllServices - maxAllowed;
    const reduceAmount = Math.min(excess + 0.05, 0.2); // Giảm tối đa 0.2 mỗi lần
    
    // Giảm từ service có giá trị lớn nhất
    if (elearningRounded >= crmRounded && elearningRounded >= adminRounded && elearningRounded >= apiRounded && elearningRounded > 0.1) {
      elearningRounded = Math.max(0.1, parseFloat((elearningRounded - reduceAmount).toFixed(1)));
    } else if (crmRounded >= adminRounded && crmRounded >= apiRounded && crmRounded > 0.1) {
      crmRounded = Math.max(0.1, parseFloat((crmRounded - reduceAmount).toFixed(1)));
    } else if (adminRounded >= apiRounded && adminRounded > 0.1) {
      adminRounded = Math.max(0.1, parseFloat((adminRounded - reduceAmount).toFixed(1)));
    } else if (apiRounded > 0.1) {
      apiRounded = Math.max(0.1, parseFloat((apiRounded - reduceAmount).toFixed(1)));
    } else {
      // Nếu tất cả đều = 0.1, không thể giảm thêm
      break;
    }
    
    // Tính lại tổng
    total = parseFloat((elearningRounded + crmRounded + adminRounded + apiRounded).toFixed(2));
    totalAllServices = total + otherServicesTotal;
  }
  
  return {
    elearning: elearningRounded,
    crm: crmRounded,
    admin: adminRounded,
    api: apiRounded,
    mongodb: mongodbCpu,
    minio: minioCpu,
    redis: redisCpu,
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
  let inMongodb = false;
  let inMinio = false;
  let inRedis = false;
  let mongodbHasCpus = false;
  let minioHasCpus = false;
  let redisHasCpus = false;
  let updatedCount = 0;
  
  const updatedLines = lines.map((line, index) => {
    // Detect service block (service name có thể có hoặc không có indent)
    if (line.match(/^(\s*)api:\s*$/)) {
      inApi = true;
      inAdmin = false;
      inCrm = false;
      inElearning = false;
      inMongodb = false;
      inMinio = false;
      inRedis = false;
      console.log(`   [DEBUG] Detected API service`);
    } else if (line.match(/^(\s*)admin:\s*$/)) {
      inApi = false;
      inAdmin = true;
      inCrm = false;
      inElearning = false;
      inMongodb = false;
      inMinio = false;
      inRedis = false;
      console.log(`   [DEBUG] Detected Admin service`);
      inApi = false;
      inAdmin = true;
      inCrm = false;
      inElearning = false;
      inMongodb = false;
      inMinio = false;
      inRedis = false;
    } else if (line.match(/^(\s*)crm:\s*$/)) {
      inApi = false;
      inAdmin = false;
      inCrm = true;
      inElearning = false;
      inMongodb = false;
      inMinio = false;
      inRedis = false;
      console.log(`   [DEBUG] Detected CRM service`);
    } else if (line.match(/^(\s*)elearning:\s*$/)) {
      inApi = false;
      inAdmin = false;
      inCrm = false;
      inElearning = true;
      inMongodb = false;
      inMinio = false;
      inRedis = false;
      console.log(`   [DEBUG] Detected E-Learning service`);
      inApi = false;
      inAdmin = false;
      inCrm = false;
      inElearning = true;
      inMongodb = false;
      inMinio = false;
      inRedis = false;
    } else if (line.match(/^(\s*)mongodb:\s*$/)) {
      inApi = false;
      inAdmin = false;
      inCrm = false;
      inElearning = false;
      inMongodb = true;
      inMinio = false;
      inRedis = false;
      mongodbHasCpus = false; // Reset flag
    } else if (line.match(/^(\s*)minio:\s*$/)) {
      inApi = false;
      inAdmin = false;
      inCrm = false;
      inElearning = false;
      inMongodb = false;
      inMinio = true;
      inRedis = false;
      minioHasCpus = false; // Reset flag
    } else if (line.match(/^(\s*)redis:\s*$/)) {
      inApi = false;
      inAdmin = false;
      inCrm = false;
      inElearning = false;
      inMongodb = false;
      inMinio = false;
      inRedis = true;
      redisHasCpus = false; // Reset flag
    } else if (line.match(/^\s*\w+:\s*$/) && !line.match(/^\s*(api|admin|crm|elearning|mongodb|minio|redis):\s*$/)) {
      // Reset flags when entering a new service
      inApi = false;
      inAdmin = false;
      inCrm = false;
      inElearning = false;
      inMongodb = false;
      inMinio = false;
      inRedis = false;
    }
    
    // Check if service already has cpus limit
    if (line.match(/cpus:\s*['"][\d.]+['"]/)) {
      if (inMongodb) mongodbHasCpus = true;
      if (inMinio) minioHasCpus = true;
      if (inRedis) redisHasCpus = true;
    }
    
    // Update cpus line (match cả khi có comment)
    if (line.match(/cpus:\s*['"][\d.]+['"]/)) {
      const indent = line.match(/^(\s+)/) ? line.match(/^(\s+)/)[1] : '    ';
      const comment = line.match(/#.*$/) ? '  ' + line.match(/#.*$/)[0] : '';
      
      // Debug: log khi tìm thấy dòng cpus
      if (inApi || inAdmin || inCrm || inElearning || inMongodb || inMinio || inRedis) {
        console.log(`   [DEBUG] Found cpus line: ${line.trim()}, inApi=${inApi}, inAdmin=${inAdmin}, inCrm=${inCrm}, inElearning=${inElearning}`);
      }
      
      if (inApi) {
        const oldValue = line.match(/cpus:\s*['"]([\d.]+)['"]/)[1];
        const newLine = `${indent}cpus: '${allocation.api}'${comment}`;
        console.log(`   API: ${oldValue} -> ${allocation.api}`);
        updatedCount++;
        return newLine;
      } else if (inAdmin) {
        const oldValue = line.match(/cpus:\s*['"]([\d.]+)['"]/)[1];
        const newLine = `${indent}cpus: '${allocation.admin}'${comment}`;
        console.log(`   Admin: ${oldValue} -> ${allocation.admin}`);
        updatedCount++;
        return newLine;
      } else if (inCrm) {
        const oldValue = line.match(/cpus:\s*['"]([\d.]+)['"]/)[1];
        const newLine = `${indent}cpus: '${allocation.crm}'${comment}`;
        console.log(`   CRM: ${oldValue} -> ${allocation.crm}`);
        updatedCount++;
        return newLine;
      } else if (inElearning) {
        const oldValue = line.match(/cpus:\s*['"]([\d.]+)['"]/)[1];
        const newLine = `${indent}cpus: '${allocation.elearning}'${comment}`;
        console.log(`   E-Learning: ${oldValue} -> ${allocation.elearning}`);
        updatedCount++;
        return newLine;
      } else if (inMongodb) {
        const oldValue = line.match(/cpus:\s*['"]([\d.]+)['"]/)[1];
        const newLine = `${indent}cpus: '${allocation.mongodb}'${comment}`;
        console.log(`   MongoDB: ${oldValue} -> ${allocation.mongodb}`);
        return newLine;
      } else if (inMinio) {
        const oldValue = line.match(/cpus:\s*['"]([\d.]+)['"]/)[1];
        const newLine = `${indent}cpus: '${allocation.minio}'${comment}`;
        console.log(`   MinIO: ${oldValue} -> ${allocation.minio}`);
        return newLine;
      } else if (inRedis) {
        const oldValue = line.match(/cpus:\s*['"]([\d.]+)['"]/)[1];
        const newLine = `${indent}cpus: '${allocation.redis}'${comment}`;
        console.log(`   Redis: ${oldValue} -> ${allocation.redis}`);
        return newLine;
      }
    }
    
    // Add cpus limit if service doesn't have one (add before networks line)
    if (inMongodb && line.match(/^\s+networks:/) && !mongodbHasCpus) {
      const indent = line.match(/^(\s+)/)[1];
      const cpusLine = `${indent}cpus: '${allocation.mongodb}'  # CPU limit`;
      console.log(`   MongoDB: added cpus limit -> ${allocation.mongodb}`);
      return `${cpusLine}\n${line}`;
    }
    if (inMinio && line.match(/^\s+networks:/) && !minioHasCpus) {
      const indent = line.match(/^(\s+)/)[1];
      const cpusLine = `${indent}cpus: '${allocation.minio}'  # CPU limit`;
      console.log(`   MinIO: added cpus limit -> ${allocation.minio}`);
      return `${cpusLine}\n${line}`;
    }
    if (inRedis && line.match(/^\s+networks:/) && !redisHasCpus) {
      const indent = line.match(/^(\s+)/)[1];
      const cpusLine = `${indent}cpus: '${allocation.redis}'  # CPU limit`;
      console.log(`   Redis: added cpus limit -> ${allocation.redis}`);
      return `${cpusLine}\n${line}`;
    }
    
    return line;
  });
  
  fs.writeFileSync(filePath, updatedLines.join('\n'), 'utf-8');
  console.log(`✅ Đã cập nhật ${path.basename(filePath)} (${updatedCount} services updated)`);
  if (updatedCount === 0) {
    console.warn(`⚠️  Warning: Không tìm thấy dòng cpus nào để cập nhật trong ${path.basename(filePath)}`);
  }
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
  console.log(`  E-Learning Portal: ${allocation.elearning} cores (37.5% của ${(totalCores - allocation.mongodb - allocation.minio - allocation.redis).toFixed(1)} cores còn lại)`);
  console.log(`  CRM Portal:        ${allocation.crm} cores (37.5% của ${(totalCores - allocation.mongodb - allocation.minio - allocation.redis).toFixed(1)} cores còn lại)`);
  console.log(`  Admin Portal:      ${allocation.admin} cores (12.5% của ${(totalCores - allocation.mongodb - allocation.minio - allocation.redis).toFixed(1)} cores còn lại)`);
  console.log(`  API Server:        ${allocation.api} cores (12.5% của ${(totalCores - allocation.mongodb - allocation.minio - allocation.redis).toFixed(1)} cores còn lại)`);
  console.log(`  MongoDB:           ${allocation.mongodb} cores`);
  console.log(`  MinIO:             ${allocation.minio} cores`);
  console.log(`  Redis:             ${allocation.redis} cores`);
  const totalAllocated = allocation.elearning + allocation.crm + allocation.admin + allocation.api + 
                         allocation.mongodb + allocation.minio + allocation.redis;
  console.log(`  Tổng phân bổ:      ${totalAllocated.toFixed(2)} cores / ${totalCores} cores (${((totalAllocated / totalCores) * 100).toFixed(1)}%)`);
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


