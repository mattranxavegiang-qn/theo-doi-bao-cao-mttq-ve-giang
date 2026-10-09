/************************************************************
 * HỆ THỐNG THỐNG KÊ BÁO CÁO MTTQ VIỆT NAM XÃ VỆ GIANG
 *
 * Mô hình:
 * GOOGLE FORM -> FORM RESPONSES 1 -> DASHBOARD -> BÁO CÁO THÁNG
 *
 * Bản này dùng cho FORM ĐÃ TỒN TẠI.
 * KHÔNG chạy createBaoCaoMatTranForm() của mã cũ nữa.
 ************************************************************/

const CONFIG = {
  // Bảng tính mới Sếp vừa tạo
  SPREADSHEET_ID: '1pw7qLDLicuZDlSbnA0a9b9hnZSdO08IAJO3RlPIv27I',

  // Tên sheet dữ liệu Forms
  DATA_SHEET_NAME: 'Câu trả lời biểu mẫu 1',

  // Các sheet hệ thống
  DASHBOARD: 'DASHBOARD',
  DANH_MUC: 'DANH_MUC',
  THONG_KE_THANG: 'THONG_KE_THANG',
  TIEN_DO_BAO_CAO: 'TIEN_DO_BAO_CAO',
  BAO_CAO_THANG: 'BAO_CAO_THANG',
  NOI_DUNG_TONG_HOP: 'NOI_DUNG_TONG_HOP',
  DANH_SACH_BAO_CAO: 'DANH_SACH_BAO_CAO',

  HEADER_ROW: 1,

  // Mỗi đơn vị chỉ tính 01 báo cáo/tháng; nếu gửi lại thì lấy lần mới nhất.
  DEDUPLICATE_BY_UNIT_MONTH: true
};

// Tên cột phải bám đúng Form hiện tại của Sếp.
const FIELD = {
  timestamp: 'Dấu thời gian',
  unitType: '1. Loại đơn vị báo cáo',
  unitName: '2. Tên thôn hoặc tổ chức',
  reportMonth: '3. Tháng báo cáo',
  reporter: '4. Người thực hiện báo cáo',
  phone: '5. Số điện thoại liên hệ',

  propaganda: '10. Số cuộc tuyên truyền',
  participants: '11. Số lượt người tham gia',
  supportMoney: '25. Tổng số tiền hỗ trợ, vận động (đồng)',
  supportedHouseholds: '26. Số hộ được hỗ trợ',
  models: '27. Số mô hình, công trình, phần việc',

  totalDebt: '53. Tổng dư nợ (đồng)',
  borrowerHouseholds: '54. Số hộ vay',
  disbursement: '55. Số tiền giải ngân trong tháng (đồng)',
  recovery: '56. Số tiền thu hồi nợ trong tháng (đồng)',
  overdue: '57. Nợ quá hạn (đồng)',

  thought: '6. Tình hình tư tưởng, dư luận xã hội',
  concern: '7. Những vấn đề Nhân dân quan tâm, bức xúc',
  religion: '8. Tình hình tôn giáo, dân tộc',
  issues: '9. Các vấn đề nổi lên (an ninh, đất đai, môi trường...)',

  propagandaDetail: '12. Tuyên truyền chủ trương của Đảng, chính sách pháp luật',
  holidayDetail: '13. Tuyên truyền các ngày lễ lớn, sự kiện chính trị',
  organizationActivity: '14. Hoạt động tuyên truyền của tổ chức',
  socialMedia: '15. Tuyên truyền trên Fanpage, Zalo, mạng xã hội',
  publicOpinion: '16. Công tác nắm bắt, phản ánh dư luận xã hội',
  goodExamples: '17. Gương người tốt, việc tốt',

  solidarity: '18. Hoạt động đoàn kết, tương trợ',
  movements: '19. Vận động Nhân dân tham gia phong trào',
  massOrganizations: '20. Hoạt động của các đoàn thể, hội',
  selfManagedCommunity: '21. Xây dựng khu dân cư tự quản',
  ntm: "22. Kết quả Cuộc vận động 'Toàn dân đoàn kết xây dựng nông thôn mới, đô thị văn minh'",
  forPoor: "23. Hoạt động 'Vì người nghèo', an sinh xã hội",
  care: '24. Hoạt động hỗ trợ, chăm lo của các đoàn thể, hội',
  unityDay: '28. Hoạt động Ngày hội Đại đoàn kết toàn dân tộc',
  security: '29. Phong trào Toàn dân bảo vệ an ninh Tổ quốc',

  supervisionCadres: '30. Giám sát cán bộ, đảng viên nơi cư trú',
  supervisionProjects: '31. Tham gia giám sát công trình, chính sách',
  citizenFeedback: '32. Tiếp nhận, phản ánh ý kiến Nhân dân',
  partyGovContribution: '33. Tham gia góp ý xây dựng Đảng, chính quyền',
  voterMeeting: '34. Tham gia tiếp xúc cử tri',

  religionWork: '35. Nắm tình hình, vận động đồng bào tôn giáo, dân tộc',
  dignitaries: '36. Hoạt động thăm hỏi, gặp gỡ chức sắc, người có uy tín',
  socialSecurityMovement: '37. Vận động tham gia phong trào, an sinh xã hội',

  coordination: '38. Phối hợp với Chi bộ, Trưởng thôn, các đoàn thể',
  conferences: '39. Tham gia giao ban, hội nghị',
  organizationConsolidation: '40. Kiện toàn tổ chức (nếu có)',
  digitalReport: '41. Báo cáo qua Zalo, phần mềm Mặt trận số',
  fanpage: '42. Hoạt động Fanpage, nhóm cộng đồng',
  initiative: '43. Sáng kiến, mô hình mới',

  advantages: '44. Ưu điểm nổi bật',
  limitations: '45. Hạn chế, tồn tại',
  causes: '46. Nguyên nhân',
  rating: '47. Tự đánh giá mức độ hoàn thành nhiệm vụ',

  nextFocus: '48. Nội dung trọng tâm cụ thể',
  solutions: '49. Giải pháp thực hiện',
  otherTasks: '50. Các nhiệm vụ trọng tâm khác',

  petitionMTTQ: '51. Kiến nghị đối với Ban Thường trực Ủy ban MTTQ Việt Nam xã',
  petitionAuthority: '52. Kiến nghị đối với cấp ủy, chính quyền',

  creditDifficulties: '58. Khó khăn, vướng mắc trong công tác tín dụng chính sách',
  funds: '59. Quỹ hội, nguồn quỹ vận động khác',
  socialization: '60. Vận động xã hội hóa',
  livelihood: '61. Hỗ trợ sinh kế, an sinh xã hội khác',

  imageDescription: '62. Mô tả hình ảnh hoạt động nổi bật trong tháng',
  driveLink: '63. Link Google Drive chứa ảnh hoạt động (nếu có)',
  articleLink: '64. Link bài viết/Fanpage/Zalo',
  proposePost: '65. Đề xuất đăng tin trên Trang thông tin điện tử hoặc Fanpage xã'
};

/**********************
 * MENU
 **********************/
function onOpen() {
  try {
    SpreadsheetApp.getUi()
      .createMenu('📊 THỐNG KÊ MTTQ')
      .addItem('⚙️ Cài đặt hệ thống lần đầu', 'caiDatHeThong')
      .addSeparator()
      .addItem('🔄 Cập nhật Dashboard', 'capNhatDashboard')
      .addItem('📋 Xem danh sách báo cáo', 'capNhatDanhSachBaoCao')
      .addItem('📋 Tạo báo cáo tháng', 'taoBaoCaoThang')
      .addItem('📈 Cập nhật thống kê tháng', 'capNhatThongKeThang')
      .addItem('✅ Cập nhật tiến độ báo cáo', 'capNhatTienDoBaoCao')
      .addItem('📝 Cập nhật nội dung tổng hợp', 'capNhatNoiDungTongHop')
      .addSeparator()
      .addItem('🕒 Cài lại Trigger tự động', 'caiDatTriggers')
      .addToUi();
  } catch (err) {
    console.log('onOpen: ' + err.message);
  }
}

/**********************
 * CÀI ĐẶT HỆ THỐNG
 **********************/
function caiDatHeThong() {
  const ss = getSpreadsheet_();
  const dataSheet = getDataSheet_(ss);
  if (!dataSheet) {
    throw new Error('Chưa tìm thấy Sheet dữ liệu Google Forms. Hãy kiểm tra lại liên kết Form với bảng tính này.');
  }

  taoDanhMuc_(ss);
  capNhatThongKeThangTK_(ss);
  capNhatDashboardTK_(ss, true);
  capNhatTienDoBaoCaoTK_(ss);
  capNhatBaoCaoThangTK_(ss);
  capNhatNoiDungTongHopTK_(ss);
  capNhatDanhSachBaoCaoTK_(ss);
  caiDatTriggersTK_(ss);

  notify_('Đã cài đặt xong hệ thống thống kê MTTQ xã Vệ Giang.\n\nĐã tạo/cập nhật Dashboard, danh sách báo cáo, thống kê tháng và Trigger tự động.');
}

function capNhatDashboard() {
  capNhatDashboardTK_(getSpreadsheet_(), false);
}

function capNhatThongKeThang() {
  capNhatThongKeThangTK_(getSpreadsheet_());
}

function capNhatTienDoBaoCao() {
  capNhatTienDoBaoCaoTK_(getSpreadsheet_());
}

function capNhatNoiDungTongHop() {
  capNhatNoiDungTongHopTK_(getSpreadsheet_());
}

function capNhatDanhSachBaoCao() {
  capNhatDanhSachBaoCaoTK_(getSpreadsheet_());
  notify_('Đã cập nhật danh sách báo cáo.');
}

function taoBaoCaoThang() {
  const ss = getSpreadsheet_();
  capNhatDashboardTK_(ss, false);
  capNhatThongKeThangTK_(ss);
  capNhatTienDoBaoCaoTK_(ss);
  capNhatBaoCaoThangTK_(ss);
  capNhatNoiDungTongHopTK_(ss);
  capNhatDanhSachBaoCaoTK_(ss);
  notify_('Đã cập nhật bộ báo cáo tháng và danh sách đơn vị.');
}

function caiDatTriggers() {
  caiDatTriggersTK_(getSpreadsheet_());
  notify_('Đã cài lại Trigger tự động.');
}

/**********************
 * TRIGGER KHI FORM GỬI
 **********************/
function onFormSubmit(e) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return;

  try {
    const ss = getSpreadsheet_();
    Utilities.sleep(800);
    capNhatThongKeThangTK_(ss);
    capNhatDashboardTK_(ss, false);
    capNhatTienDoBaoCaoTK_(ss);
    capNhatBaoCaoThangTK_(ss);
    capNhatNoiDungTongHopTK_(ss);
    capNhatDanhSachBaoCaoTK_(ss);
  } catch (err) {
    console.error('onFormSubmit ERROR: ' + err.stack);
  } finally {
    lock.releaseLock();
  }
}

/**********************
 * HÀM MỞ FILE
 **********************/
function getSpreadsheet_() {
  return SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
}

function getDataSheet_(ss) {
  const sh = ss.getSheetByName(CONFIG.DATA_SHEET_NAME);
  if (sh) return sh;

  // Dự phòng: tự tìm sheet có header Timestamp + trường đơn vị.
  const sheets = ss.getSheets();
  for (let i = 0; i < sheets.length; i++) {
    const s = sheets[i];
    if ([CONFIG.DASHBOARD, CONFIG.DANH_MUC, CONFIG.THONG_KE_THANG,
      CONFIG.TIEN_DO_BAO_CAO, CONFIG.BAO_CAO_THANG, CONFIG.NOI_DUNG_TONG_HOP, CONFIG.DANH_SACH_BAO_CAO].indexOf(s.getName()) >= 0) continue;
    if (s.getLastRow() >= 1 && s.getLastColumn() >= 4) {
      const h = s.getRange(1, 1, 1, s.getLastColumn()).getDisplayValues()[0];
      if (h.indexOf(FIELD.timestamp) >= 0 && h.indexOf(FIELD.unitType) >= 0) return s;
    }
  }
  return null;
}

/**********************
 * ĐỌC DỮ LIỆU FORMS
 **********************/
function getDataTK_(ss) {
  const sheet = getDataSheet_(ss);
  if (!sheet) {
    throw new Error('Không tìm thấy sheet dữ liệu Google Forms.');
  }

  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < 2 || lastCol < 2) {
    return { sheet: sheet, headers: [], rows: [], reports: [] };
  }

  const values = sheet.getRange(CONFIG.HEADER_ROW, 1, lastRow, lastCol).getValues();
  const headers = values[0].map(function(h) { return String(h || '').trim(); });
  const rows = values.slice(1);
  const reports = buildReportsTK_(headers, rows);

  return { sheet: sheet, headers: headers, rows: rows, reports: reports };
}

function buildReportsTK_(headers, rows) {
  const idx = {};
  Object.keys(FIELD).forEach(function(key) {
    idx[key] = findHeader_(headers, FIELD[key]);
  });

  const raw = [];

  rows.forEach(function(row, rowIndex) {
    if (row.every(function(v) { return v === '' || v === null; })) return;

    const timestamp = idx.timestamp >= 0
      ? safeDate_(row[idx.timestamp])
      : null;

    const unitType = text_(idx.unitType >= 0 ? row[idx.unitType] : '');
    const unitName = text_(idx.unitName >= 0 ? row[idx.unitName] : '');
    const month = normalizeMonth_(idx.reportMonth >= 0 ? row[idx.reportMonth] : '', timestamp);

    raw.push({
      sourceRow: rowIndex + 2,
      timestamp: timestamp,
      unitType: unitType || 'Chưa xác định',
      unitName: unitName || 'Chưa xác định',
      month: month,
      reporter: text_(idx.reporter >= 0 ? row[idx.reporter] : ''),
      phone: text_(idx.phone >= 0 ? row[idx.phone] : ''),

      propaganda: number_(idx.propaganda >= 0 ? row[idx.propaganda] : 0),
      participants: number_(idx.participants >= 0 ? row[idx.participants] : 0),
      supportMoney: number_(idx.supportMoney >= 0 ? row[idx.supportMoney] : 0),
      supportedHouseholds: number_(idx.supportedHouseholds >= 0 ? row[idx.supportedHouseholds] : 0),
      models: number_(idx.models >= 0 ? row[idx.models] : 0),
      totalDebt: number_(idx.totalDebt >= 0 ? row[idx.totalDebt] : 0),
      borrowerHouseholds: number_(idx.borrowerHouseholds >= 0 ? row[idx.borrowerHouseholds] : 0),
      disbursement: number_(idx.disbursement >= 0 ? row[idx.disbursement] : 0),
      recovery: number_(idx.recovery >= 0 ? row[idx.recovery] : 0),
      overdue: number_(idx.overdue >= 0 ? row[idx.overdue] : 0),

      thought: text_(idx.thought >= 0 ? row[idx.thought] : ''),
      concern: text_(idx.concern >= 0 ? row[idx.concern] : ''),
      religion: text_(idx.religion >= 0 ? row[idx.religion] : ''),
      issues: text_(idx.issues >= 0 ? row[idx.issues] : ''),
      propagandaDetail: text_(idx.propagandaDetail >= 0 ? row[idx.propagandaDetail] : ''),
      holidayDetail: text_(idx.holidayDetail >= 0 ? row[idx.holidayDetail] : ''),
      organizationActivity: text_(idx.organizationActivity >= 0 ? row[idx.organizationActivity] : ''),
      socialMedia: text_(idx.socialMedia >= 0 ? row[idx.socialMedia] : ''),
      publicOpinion: text_(idx.publicOpinion >= 0 ? row[idx.publicOpinion] : ''),
      goodExamples: text_(idx.goodExamples >= 0 ? row[idx.goodExamples] : ''),
      solidarity: text_(idx.solidarity >= 0 ? row[idx.solidarity] : ''),
      movements: text_(idx.movements >= 0 ? row[idx.movements] : ''),
      massOrganizations: text_(idx.massOrganizations >= 0 ? row[idx.massOrganizations] : ''),
      selfManagedCommunity: text_(idx.selfManagedCommunity >= 0 ? row[idx.selfManagedCommunity] : ''),
      ntm: text_(idx.ntm >= 0 ? row[idx.ntm] : ''),
      forPoor: text_(idx.forPoor >= 0 ? row[idx.forPoor] : ''),
      care: text_(idx.care >= 0 ? row[idx.care] : ''),
      unityDay: text_(idx.unityDay >= 0 ? row[idx.unityDay] : ''),
      security: text_(idx.security >= 0 ? row[idx.security] : ''),
      supervisionCadres: text_(idx.supervisionCadres >= 0 ? row[idx.supervisionCadres] : ''),
      supervisionProjects: text_(idx.supervisionProjects >= 0 ? row[idx.supervisionProjects] : ''),
      citizenFeedback: text_(idx.citizenFeedback >= 0 ? row[idx.citizenFeedback] : ''),
      partyGovContribution: text_(idx.partyGovContribution >= 0 ? row[idx.partyGovContribution] : ''),
      voterMeeting: text_(idx.voterMeeting >= 0 ? row[idx.voterMeeting] : ''),
      religionWork: text_(idx.religionWork >= 0 ? row[idx.religionWork] : ''),
      dignitaries: text_(idx.dignitaries >= 0 ? row[idx.dignitaries] : ''),
      socialSecurityMovement: text_(idx.socialSecurityMovement >= 0 ? row[idx.socialSecurityMovement] : ''),
      coordination: text_(idx.coordination >= 0 ? row[idx.coordination] : ''),
      conferences: text_(idx.conferences >= 0 ? row[idx.conferences] : ''),
      organizationConsolidation: text_(idx.organizationConsolidation >= 0 ? row[idx.organizationConsolidation] : ''),
      digitalReport: text_(idx.digitalReport >= 0 ? row[idx.digitalReport] : ''),
      fanpage: text_(idx.fanpage >= 0 ? row[idx.fanpage] : ''),
      initiative: text_(idx.initiative >= 0 ? row[idx.initiative] : ''),
      advantages: text_(idx.advantages >= 0 ? row[idx.advantages] : ''),
      limitations: text_(idx.limitations >= 0 ? row[idx.limitations] : ''),
      causes: text_(idx.causes >= 0 ? row[idx.causes] : ''),
      rating: text_(idx.rating >= 0 ? row[idx.rating] : ''),
      nextFocus: text_(idx.nextFocus >= 0 ? row[idx.nextFocus] : ''),
      solutions: text_(idx.solutions >= 0 ? row[idx.solutions] : ''),
      otherTasks: text_(idx.otherTasks >= 0 ? row[idx.otherTasks] : ''),
      petitionMTTQ: text_(idx.petitionMTTQ >= 0 ? row[idx.petitionMTTQ] : ''),
      petitionAuthority: text_(idx.petitionAuthority >= 0 ? row[idx.petitionAuthority] : ''),
      creditDifficulties: text_(idx.creditDifficulties >= 0 ? row[idx.creditDifficulties] : ''),
      funds: text_(idx.funds >= 0 ? row[idx.funds] : ''),
      socialization: text_(idx.socialization >= 0 ? row[idx.socialization] : ''),
      livelihood: text_(idx.livelihood >= 0 ? row[idx.livelihood] : ''),
      imageDescription: text_(idx.imageDescription >= 0 ? row[idx.imageDescription] : ''),
      driveLink: text_(idx.driveLink >= 0 ? row[idx.driveLink] : ''),
      articleLink: text_(idx.articleLink >= 0 ? row[idx.articleLink] : ''),
      proposePost: text_(idx.proposePost >= 0 ? row[idx.proposePost] : '')
    });
  });

  raw.sort(function(a, b) {
    return (a.timestamp ? a.timestamp.getTime() : 0) - (b.timestamp ? b.timestamp.getTime() : 0);
  });

  if (!CONFIG.DEDUPLICATE_BY_UNIT_MONTH) return raw;

  const latest = {};
  raw.forEach(function(report) {
    const key = makeUnitKey_(report.month, report.unitType, report.unitName);
    latest[key] = report;
  });

  return Object.keys(latest).map(function(key) { return latest[key]; }).sort(function(a, b) {
    return (b.timestamp ? b.timestamp.getTime() : 0) - (a.timestamp ? a.timestamp.getTime() : 0);
  });
}

/**********************
 * DASHBOARD
 **********************/
function capNhatDashboardTK_(ss, resetMonth) {
  const data = getDataTK_(ss);
  const reports = data.reports;
  const sh = getOrCreateSheet_(ss, CONFIG.DASHBOARD);

  let selectedMonth = readSelectedMonth_(sh);
  if (resetMonth || !selectedMonth) selectedMonth = monthKey_(new Date());

  const months = unique_(reports.map(function(r) { return r.month; }).filter(Boolean));
  const allMonths = unique_([selectedMonth].concat(months, [monthKey_(new Date())])).filter(Boolean).sort(sortMonth_);
  const current = reports.filter(function(r) { return r.month === selectedMonth; });
  const totals = sumReports_(current);
  const expected = getExpectedUnits_(ss);

  const submitted = {};
  current.forEach(function(r) {
    submitted[normalizeText_(r.unitType) + '|' + normalizeText_(r.unitName)] = r;
  });

  const missing = expected.filter(function(u) {
    const key = normalizeText_(u.type) + '|' + normalizeText_(u.name);
    return !submitted[key];
  });

  const submittedUnits = expected.length
    ? expected.filter(function(u) {
        const key = normalizeText_(u.type) + '|' + normalizeText_(u.name);
        return !!submitted[key];
      })
    : current.map(function(r) { return { type: r.unitType, name: r.unitName }; });

  const submittedCount = expected.length ? submittedUnits.length : current.length;
  const coverage = expected.length ? submittedCount / expected.length : null;

  // Xóa giao diện cũ và biểu đồ cũ.
  sh.clear();
  sh.getCharts().forEach(function(c) { sh.removeChart(c); });
  sh.getRange('A1:L70').breakApart();

  // Tiêu đề.
  sh.getRange('A1:L1').merge();
  sh.getRange('A1').setValue('DASHBOARD THỐNG KÊ BÁO CÁO CÔNG TÁC MẶT TRẬN');
  sh.getRange('A2:L2').merge();
  sh.getRange('A2').setValue('ỦY BAN MTTQ VIỆT NAM XÃ VỆ GIANG');
  sh.getRange('A1:L2').setHorizontalAlignment('center').setVerticalAlignment('middle');
  sh.getRange('A1').setFontSize(18).setFontWeight('bold');
  sh.getRange('A2').setFontSize(13).setFontWeight('bold');

  sh.getRange('A4').setValue('KỲ BÁO CÁO');
  sh.getRange('B4').setValue(selectedMonth);
  sh.getRange('D4').setValue('CẬP NHẬT LÚC');
  sh.getRange('E4').setValue(new Date()).setNumberFormat('dd/MM/yyyy HH:mm:ss');
  sh.getRange('A4:E4').setFontWeight('bold');

  // KPI 1.
  writeKpi_(sh, 'A6:B7', 'TỔNG BÁO CÁO', current.length, '#,##0');
  writeKpi_(sh, 'C6:D7', 'ĐƠN VỊ ĐÃ BÁO CÁO', submittedCount, '#,##0');
  writeKpi_(sh, 'E6:F7', 'ĐƠN VỊ CHƯA BÁO CÁO', missing.length, '#,##0');
  writeKpi_(sh, 'G6:H7', 'TỶ LỆ NỘP', coverage, '0.0%');
  writeKpi_(sh, 'I6:J7', 'TỔNG HỖ TRỢ / VẬN ĐỘNG', totals.supportMoney, '#,##0');
  writeKpi_(sh, 'K6:L7', 'SỐ HỘ ĐƯỢC HỖ TRỢ', totals.supportedHouseholds, '#,##0');

  // KPI 2.
  writeKpi_(sh, 'A9:B10', 'SỐ CUỘC TUYÊN TRUYỀN', totals.propaganda, '#,##0');
  writeKpi_(sh, 'C9:D10', 'LƯỢT NGƯỜI THAM GIA', totals.participants, '#,##0');
  writeKpi_(sh, 'E9:F10', 'SỐ MÔ HÌNH/CÔNG TRÌNH', totals.models, '#,##0');
  writeKpi_(sh, 'G9:H10', 'TỔNG DƯ NỢ', totals.totalDebt, '#,##0');
  writeKpi_(sh, 'I9:J10', 'SỐ HỘ VAY', totals.borrowerHouseholds, '#,##0');
  writeKpi_(sh, 'K9:L10', 'NỢ QUÁ HẠN', totals.overdue, '#,##0');

  // Danh sách trên Dashboard: đã gửi / chưa gửi.
  sh.getRange('A30:F30').merge();
  sh.getRange('A30').setValue('DANH SÁCH ĐƠN VỊ ĐÃ BÁO CÁO');
  styleHeader_(sh.getRange('A30:F30'));
  sh.getRange('A31:C31').setValues([['STT', 'Tên đơn vị', 'Loại đơn vị']]);
  styleHeader_(sh.getRange('A31:C31'));
  const submittedRows = submittedUnits.map(function(u, i) { return [i + 1, u.name, u.type]; });
  if (submittedRows.length) sh.getRange(32, 1, submittedRows.length, 3).setValues(submittedRows);
  else sh.getRange('A32:C32').setValues([['', 'Chưa có đơn vị gửi', '']]);

  sh.getRange('G30:L30').merge();
  sh.getRange('G30').setValue('DANH SÁCH ĐƠN VỊ CHƯA BÁO CÁO');
  styleHeader_(sh.getRange('G30:L30'));
  sh.getRange('G31:I31').setValues([['STT', 'Tên đơn vị', 'Loại đơn vị']]);
  styleHeader_(sh.getRange('G31:I31'));
  const missingRows = missing.map(function(u, i) { return [i + 1, u.name, u.type]; });
  if (missingRows.length) sh.getRange(32, 7, missingRows.length, 3).setValues(missingRows);
  else sh.getRange('G32:I32').setValues([['', 'Không có đơn vị thiếu', '']]);

  // Helper data ẩn cho biểu đồ.
  const typeRows = objectToRows_(groupCount_(current, function(r) { return r.unitType; }));
  const statusRows = [['Đã báo cáo', submittedCount], ['Chưa báo cáo', missing.length]];
  const monthRows = [];
  unique_(reports.map(function(r) { return r.month; }).filter(Boolean)).sort(sortMonth_).forEach(function(month) {
    const count = reports.filter(function(r) { return r.month === month; }).length;
    monthRows.push([month, count]);
  });
  const unitRows = objectToRows_(groupCount_(current, function(r) { return r.unitName; }));

  sh.getRange('N1:O1').setValues([['Loại đơn vị', 'Số báo cáo']]);
  if (typeRows.length) sh.getRange(2, 14, typeRows.length, 2).setValues(typeRows);
  sh.getRange('Q1:R1').setValues([['Trạng thái', 'Số lượng']]);
  sh.getRange(2, 17, statusRows.length, 2).setValues(statusRows);
  sh.getRange('T1:U1').setValues([['Tháng', 'Số báo cáo']]);
  if (monthRows.length) sh.getRange(2, 20, monthRows.length, 2).setValues(monthRows);
  sh.getRange('W1:X1').setValues([['Thôn/Tổ chức', 'Số báo cáo']]);
  if (unitRows.length) sh.getRange(2, 23, unitRows.length, 2).setValues(unitRows);
  sh.hideColumns(14, 11);

  // Biểu đồ 1: loại đơn vị.
  if (typeRows.length) {
    sh.insertChart(sh.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .addRange(sh.getRange('N1:O' + (typeRows.length + 1)))
      .setOption('title', 'Số báo cáo theo loại đơn vị')
      .setOption('legend', { position: 'none' })
      .setOption('height', 360)
      .setOption('width', 520)
      .setPosition(12, 1, 0, 0)
      .build());
  }

  // Biểu đồ 2: trạng thái nộp.
  sh.insertChart(sh.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(sh.getRange('Q1:R3'))
    .setOption('title', 'Tình trạng nộp báo cáo')
    .setOption('pieHole', 0.45)
    .setOption('height', 360)
    .setOption('width', 520)
    .setPosition(12, 7, 0, 0)
    .build());

  // Biểu đồ 3: xu hướng theo tháng.
  if (monthRows.length) {
    sh.insertChart(sh.newChart()
      .setChartType(Charts.ChartType.LINE)
      .addRange(sh.getRange('T1:U' + (monthRows.length + 1)))
      .setOption('title', 'Xu hướng số báo cáo theo tháng')
      .setOption('legend', { position: 'none' })
      .setOption('height', 350)
      .setOption('width', 520)
      .setPosition(48, 1, 0, 0)
      .build());
  }

  // Biểu đồ 4: theo thôn/tổ chức.
  if (unitRows.length) {
    sh.insertChart(sh.newChart()
      .setChartType(Charts.ChartType.BAR)
      .addRange(sh.getRange('W1:X' + (unitRows.length + 1)))
      .setOption('title', 'Số báo cáo theo thôn/tổ chức')
      .setOption('legend', { position: 'none' })
      .setOption('height', 350)
      .setOption('width', 520)
      .setPosition(48, 7, 0, 0)
      .build());
  }

  styleDashboard_(sh, 70);
  sh.setFrozenRows(4);
}

/**********************
 * THỐNG KÊ THEO THÁNG
 **********************/
function capNhatThongKeThangTK_(ss) {
  const data = getDataTK_(ss);
  const reports = data.reports;
  const sh = getOrCreateSheet_(ss, CONFIG.THONG_KE_THANG);
  sh.clear();
  sh.getRange('A1:M2').breakApart();

  sh.getRange('A1:M1').merge();
  sh.getRange('A1').setValue('THỐNG KÊ TỔNG HỢP THEO THÁNG');
  sh.getRange('A1').setFontSize(15).setFontWeight('bold').setHorizontalAlignment('center');

  sh.getRange('A2:M2').setValues([[
    'Tháng', 'Số báo cáo', 'Số đơn vị', 'Số cuộc tuyên truyền',
    'Lượt người tham gia', 'Tiền hỗ trợ/vận động (đồng)', 'Số hộ hỗ trợ',
    'Số mô hình/công trình', 'Tổng dư nợ (đồng)', 'Số hộ vay',
    'Giải ngân (đồng)', 'Thu hồi nợ (đồng)', 'Nợ quá hạn (đồng)'
  ]]);
  styleHeader_(sh.getRange('A2:M2'));

  const months = unique_(reports.map(function(r) { return r.month; }).filter(Boolean)).sort(sortMonth_);
  const output = [];

  months.forEach(function(month) {
    const current = reports.filter(function(r) { return r.month === month; });
    const t = sumReports_(current);
    const units = {};
    current.forEach(function(r) {
      units[makeUnitKey_(month, r.unitType, r.unitName)] = true;
    });

    output.push([
      month,
      current.length,
      Object.keys(units).length,
      t.propaganda,
      t.participants,
      t.supportMoney,
      t.supportedHouseholds,
      t.models,
      t.totalDebt,
      t.borrowerHouseholds,
      t.disbursement,
      t.recovery,
      t.overdue
    ]);
  });

  if (output.length) sh.getRange(3, 1, output.length, 13).setValues(output);
  if (output.length) sh.getRange(3, 6, output.length, 8).setNumberFormat('#,##0');
  sh.getRange('A1:M' + Math.max(3, output.length + 2)).setWrap(true);
  sh.setFrozenRows(2);
  sh.autoResizeColumns(1, 13);
}

/**********************
 * DANH SÁCH BÁO CÁO
 **********************/
function capNhatDanhSachBaoCaoTK_(ss) {
  const data = getDataTK_(ss);
  const reports = data.reports;
  const dashboard = getOrCreateSheet_(ss, CONFIG.DASHBOARD);
  const selected = readSelectedMonth_(dashboard) || monthKey_(new Date());
  const expected = getExpectedUnits_(ss);
  const sh = getOrCreateSheet_(ss, CONFIG.DANH_SACH_BAO_CAO);

  sh.clear();
  if (sh.getFilter()) sh.getFilter().remove();

  sh.getRange('A1:H1').merge();
  sh.getRange('A1').setValue('DANH SÁCH THEO DÕI BÁO CÁO KỲ ' + selected);
  sh.getRange('A1').setFontSize(15).setFontWeight('bold').setHorizontalAlignment('center');
  sh.getRange('A2:H2').setValues([[
    'STT', 'Loại đơn vị', 'Tên thôn/tổ chức', 'Trạng thái',
    'Thời gian gửi', 'Người báo cáo', 'Số liệu chính', 'Ghi chú'
  ]]);
  styleHeader_(sh.getRange('A2:H2'));

  const submitted = {};
  reports.filter(function(r) { return r.month === selected; }).forEach(function(r) {
    submitted[normalizeText_(r.unitType) + '|' + normalizeText_(r.unitName)] = r;
  });

  const units = expected.length ? expected.slice() : reports.filter(function(r) { return r.month === selected; }).map(function(r) {
    return { type: r.unitType, name: r.unitName };
  });

  const rows = units.map(function(u, i) {
    const key = normalizeText_(u.type) + '|' + normalizeText_(u.name);
    const r = submitted[key];
    const main = r ? [
      'Tuyên truyền: ' + r.propaganda,
      'Lượt người: ' + r.participants,
      'Hỗ trợ: ' + r.supportMoney,
      'Hộ hỗ trợ: ' + r.supportedHouseholds,
      'Mô hình: ' + r.models
    ].join(' | ') : '';
    return [
      i + 1,
      u.type,
      u.name,
      r ? 'Đã gửi' : 'Chưa gửi',
      r && r.timestamp ? r.timestamp : '',
      r ? r.reporter : '',
      main,
      r ? 'Lần gửi mới nhất' : 'Cần đôn đốc'
    ];
  });

  if (rows.length) sh.getRange(3, 1, rows.length, 8).setValues(rows);
  if (rows.length) {
    sh.getRange(3, 5, rows.length, 1).setNumberFormat('dd/MM/yyyy HH:mm');
    sh.getRange(3, 1, rows.length, 8).setWrap(true).setVerticalAlignment('top');
    const bg = rows.map(function(r) {
      return r[3] === 'Đã gửi'
        ? ['', '', '', '#E2F0D9', '', '', '', '']
        : ['', '', '', '#FCE4D6', '', '', '', ''];
    });
    sh.getRange(3, 1, rows.length, 8).setBackgrounds(bg);
  } else {
    sh.getRange('A3:H3').setValues([['', '', 'Chưa có đơn vị trong danh mục', '', '', '', '', '']]);
  }

  sh.getRange('J2:K4').setValues([
    ['CHỈ TIÊU', 'GIÁ TRỊ'],
    ['Phải báo cáo', units.length],
    ['Đã gửi', rows.filter(function(r) { return r[3] === 'Đã gửi'; }).length]
  ]);
  styleHeader_(sh.getRange('J2:K2'));
  sh.getRange('J5:K5').setValues([['Chưa gửi', rows.filter(function(r) { return r[3] === 'Chưa gửi'; }).length]]);
  sh.getRange('A2:H' + Math.max(3, rows.length + 2)).createFilter();
  sh.setFrozenRows(2);
  sh.setColumnWidth(1, 55);
  sh.setColumnWidth(2, 220);
  sh.setColumnWidth(3, 220);
  sh.setColumnWidth(4, 105);
  sh.setColumnWidth(5, 150);
  sh.setColumnWidth(6, 150);
  sh.setColumnWidth(7, 560);
  sh.setColumnWidth(8, 160);
}

/**********************
 * TIẾN ĐỘ ĐƠN VỊ
 **********************/
function capNhatTienDoBaoCaoTK_(ss) {
  const data = getDataTK_(ss);
  const reports = data.reports;
  const dashboard = getOrCreateSheet_(ss, CONFIG.DASHBOARD);
  const selected = readSelectedMonth_(dashboard) || monthKey_(new Date());
  const expected = getExpectedUnits_(ss);

  const sh = getOrCreateSheet_(ss, CONFIG.TIEN_DO_BAO_CAO);
  sh.clear();
  sh.getRange('A1:F1').breakApart();

  sh.getRange('A1:F1').merge();
  sh.getRange('A1').setValue('TIẾN ĐỘ BÁO CÁO KỲ ' + selected);
  sh.getRange('A1').setFontSize(15).setFontWeight('bold').setHorizontalAlignment('center');

  sh.getRange('A2:F2').setValues([[
    'Loại đơn vị', 'Tên thôn/tổ chức', 'Trạng thái', 'Thời gian gửi', 'Người báo cáo', 'Ghi chú'
  ]]);
  styleHeader_(sh.getRange('A2:F2'));

  const submitted = {};
  reports.filter(function(r) { return r.month === selected; }).forEach(function(r) {
    const key = normalizeText_(r.unitType) + '|' + normalizeText_(r.unitName);
    submitted[key] = r;
  });

  const rows = expected.map(function(u) {
    const key = normalizeText_(u.type) + '|' + normalizeText_(u.name);
    const r = submitted[key];
    return [
      u.type,
      u.name,
      r ? 'Đã gửi' : 'Chưa gửi',
      r && r.timestamp ? r.timestamp : '',
      r ? r.reporter : '',
      r ? 'Lần gửi mới nhất' : 'Cần đôn đốc'
    ];
  });

  if (rows.length) sh.getRange(3, 1, rows.length, 6).setValues(rows);
  if (rows.length) sh.getRange(3, 4, rows.length, 1).setNumberFormat('dd/MM/yyyy HH:mm');

  if (rows.length) {
    const statusRange = sh.getRange(3, 3, rows.length, 1);
    statusRange.setHorizontalAlignment('center');
  }

  sh.getRange('H2:I4').setValues([
    ['Chỉ tiêu', 'Giá trị'],
    ['Phải báo cáo', expected.length],
    ['Đã gửi', rows.filter(function(r) { return r[2] === 'Đã gửi'; }).length]
  ]);
  styleHeader_(sh.getRange('H2:I2'));
  sh.getRange('H5:I5').setValues([
    ['Chưa gửi', rows.filter(function(r) { return r[2] === 'Chưa gửi'; }).length]
  ]);
  sh.getRange('H5:I5').getCell(1, 1).setFontWeight('bold');

  sh.getRange('A1:I' + Math.max(6, rows.length + 2)).setWrap(true).setVerticalAlignment('top');
  sh.setFrozenRows(2);
  sh.autoResizeColumns(1, 9);
  if (sh.getLastColumn() >= 9) sh.setColumnWidth(9, 110);
}

/**********************
 * BÁO CÁO THÁNG
 **********************/
function capNhatBaoCaoThangTK_(ss) {
  const data = getDataTK_(ss);
  const shDashboard = getOrCreateSheet_(ss, CONFIG.DASHBOARD);
  const selected = readSelectedMonth_(shDashboard) || monthKey_(new Date());
  const reports = data.reports.filter(function(r) { return r.month === selected; });
  const sh = getOrCreateSheet_(ss, CONFIG.BAO_CAO_THANG);
  sh.clear();
  sh.getRange('A1:Q2').breakApart();

  sh.getRange('A1:Q1').merge();
  sh.getRange('A1').setValue('BÁO CÁO CHI TIẾT KỲ ' + selected);
  sh.getRange('A1').setFontSize(15).setFontWeight('bold').setHorizontalAlignment('center');

  const headers = [
    'Thời gian gửi', 'Loại đơn vị', 'Tên thôn/tổ chức', 'Người báo cáo',
    'Số cuộc tuyên truyền', 'Lượt người tham gia', 'Tiền hỗ trợ/vận động',
    'Số hộ hỗ trợ', 'Số mô hình/công trình', 'Tổng dư nợ', 'Số hộ vay',
    'Giải ngân', 'Thu hồi nợ', 'Nợ quá hạn', 'Mức đánh giá',
    'Nội dung trọng tâm tháng tới', 'Kiến nghị'
  ];
  sh.getRange('A2:Q2').setValues([headers]);
  styleHeader_(sh.getRange('A2:Q2'));

  const output = reports.map(function(r) {
    return [
      r.timestamp || '', r.unitType, r.unitName, r.reporter,
      r.propaganda, r.participants, r.supportMoney, r.supportedHouseholds,
      r.models, r.totalDebt, r.borrowerHouseholds, r.disbursement,
      r.recovery, r.overdue, r.rating, r.nextFocus,
      [r.petitionMTTQ, r.petitionAuthority].filter(Boolean).join('\n')
    ];
  });

  if (output.length) sh.getRange(3, 1, output.length, 17).setValues(output);
  if (output.length) {
    sh.getRange(3, 1, output.length, 1).setNumberFormat('dd/MM/yyyy HH:mm');
    sh.getRange(3, 5, output.length, 10).setNumberFormat('#,##0');
  }
  sh.getRange('A1:Q' + Math.max(3, output.length + 2)).setWrap(true).setVerticalAlignment('top');
  sh.setFrozenRows(2);
  sh.autoResizeColumns(1, 17);
  capNhatNoiDungTongHopTK_(ss);
}

/**********************
 * NỘI DUNG TỔNG HỢP
 **********************/
function capNhatNoiDungTongHopTK_(ss) {
  const data = getDataTK_(ss);
  const shDashboard = getOrCreateSheet_(ss, CONFIG.DASHBOARD);
  const selected = readSelectedMonth_(shDashboard) || monthKey_(new Date());
  const reports = data.reports.filter(function(r) { return r.month === selected; });
  const sh = getOrCreateSheet_(ss, CONFIG.NOI_DUNG_TONG_HOP);
  sh.clear();
  sh.getRange('A1:J2').breakApart();

  sh.getRange('A1:J1').merge();
  sh.getRange('A1').setValue('NỘI DUNG TỔNG HỢP PHỤC VỤ BÁO CÁO ' + selected);
  sh.getRange('A1').setFontSize(15).setFontWeight('bold').setHorizontalAlignment('center');

  const headers = [
    'Loại đơn vị', 'Thôn/Tổ chức', 'Tư tưởng, dư luận',
    'Vấn đề Nhân dân quan tâm', 'Vấn đề nổi lên', 'Hoạt động nổi bật',
    'Ưu điểm', 'Hạn chế', 'Nhiệm vụ trọng tâm tháng tới', 'Kiến nghị/đề xuất'
  ];
  sh.getRange('A2:J2').setValues([headers]);
  styleHeader_(sh.getRange('A2:J2'));

  const output = reports.map(function(r) {
    return [
      r.unitType,
      r.unitName,
      r.thought,
      r.concern,
      r.issues,
      [
        r.organizationActivity, r.socialMedia, r.goodExamples,
        r.solidarity, r.movements, r.unityDay, r.security,
        r.initiative
      ].filter(Boolean).join('\n'),
      r.advantages,
      r.limitations,
      [r.nextFocus, r.solutions, r.otherTasks].filter(Boolean).join('\n'),
      [r.petitionMTTQ, r.petitionAuthority, r.creditDifficulties].filter(Boolean).join('\n')
    ];
  });

  if (output.length) sh.getRange(3, 1, output.length, 10).setValues(output);
  sh.getRange('A1:J' + Math.max(3, output.length + 2)).setWrap(true).setVerticalAlignment('top');
  sh.setFrozenRows(2);
  sh.autoResizeColumns(1, 10);
}

/**********************
 * DANH MỤC ĐƠN VỊ
 **********************/
function taoDanhMuc_(ss) {
  const sh = getOrCreateSheet_(ss, CONFIG.DANH_MUC);

  if (sh.getLastRow() === 0 || !sh.getRange('A1').getValue()) {
    sh.clear();
    sh.getRange('A1:D1').setValues([[
      'Loại đơn vị', 'Tên thôn hoặc tổ chức', 'Theo dõi báo cáo?', 'Ghi chú'
    ]]);

    // Các Hội đã có trong Form; Ban CTMT thôn để trống tên để Sếp nhập thực tế.
    const defaults = [
      ['Hội Nông dân', 'Hội Nông dân', 'Có', ''],
      ['Hội Liên hiệp Phụ nữ', 'Hội Liên hiệp Phụ nữ', 'Có', ''],
      ['Đoàn Thanh niên', 'Đoàn Thanh niên', 'Có', ''],
      ['Hội Cựu chiến binh', 'Hội Cựu chiến binh', 'Có', ''],
      ['Hội Người cao tuổi', 'Hội Người cao tuổi', 'Có', ''],
      ['Hội Chữ thập đỏ', 'Hội Chữ thập đỏ', 'Có', ''],
      ['Hội Khuyến học', 'Hội Khuyến học', 'Có', ''],
      ['Khác', '', 'Có', 'Chỉ dùng khi thực sự có đơn vị khác'],
      ['Ban Công tác Mặt trận thôn', '', 'Có', 'Nhập tên thôn thực tế'],
      ['Ban Công tác Mặt trận thôn', '', 'Có', 'Nhập tên thôn thực tế'],
      ['Ban Công tác Mặt trận thôn', '', 'Có', 'Nhập tên thôn thực tế'],
      ['Ban Công tác Mặt trận thôn', '', 'Có', 'Nhập tên thôn thực tế'],
      ['Ban Công tác Mặt trận thôn', '', 'Có', 'Nhập tên thôn thực tế'],
      ['Ban Công tác Mặt trận thôn', '', 'Có', 'Nhập tên thôn thực tế'],
      ['Ban Công tác Mặt trận thôn', '', 'Có', 'Nhập tên thôn thực tế'],
      ['Ban Công tác Mặt trận thôn', '', 'Có', 'Nhập tên thôn thực tế'],
      ['Ban Công tác Mặt trận thôn', '', 'Có', 'Nhập tên thôn thực tế'],
      ['Ban Công tác Mặt trận thôn', '', 'Có', 'Nhập tên thôn thực tế']
    ];
    sh.getRange(2, 1, defaults.length, 4).setValues(defaults);
  }

  sh.getRange('F1:H8').breakApart();
  sh.getRange('F1:H1').merge();
  sh.getRange('F2:H8').merge();
  styleHeader_(sh.getRange('A1:D1'));
  const trackingRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Có', 'Không'], true)
    .setAllowInvalid(false)
    .build();
  sh.getRange('C2:C500').setDataValidation(trackingRule);
  sh.getRange('A1:D500').setWrap(true);
  sh.setFrozenRows(1);
  sh.setColumnWidth(1, 220);
  sh.setColumnWidth(2, 220);
  sh.setColumnWidth(3, 130);
  sh.setColumnWidth(4, 250);

  // Hướng dẫn bên phải
  sh.getRange('F1').setValue('HƯỚNG DẪN DANH MỤC');
  styleHeader_(sh.getRange('F1:H1'));
  sh.getRange('F2').setValue(
    '• Cột A: Loại đơn vị phải trùng với lựa chọn trên Form.\n' +
    '• Cột B: Tên thôn hoặc tên tổ chức phải thống nhất cách ghi trên Form.\n' +
    '• Cột C = Có: đơn vị thuộc danh sách phải báo cáo hàng tháng.\n' +
    '• Để trống tên thôn chưa khai báo; dòng đó chưa được tính vào số đơn vị phải báo cáo.\n' +
    '• Không đổi tên các sheet hệ thống.'
  );
  sh.getRange('F2').setWrap(true).setVerticalAlignment('top');
}

function getExpectedUnits_(ss) {
  const sh = ss.getSheetByName(CONFIG.DANH_MUC);
  if (!sh || sh.getLastRow() < 2) return [];

  const rows = sh.getRange(2, 1, sh.getLastRow() - 1, 3).getValues();
  const seen = {};
  const result = [];

  rows.forEach(function(r) {
    const type = text_(r[0]);
    const name = text_(r[1]);
    const active = normalizeText_(r[2]);
    const isActive = !active || ['co', 'yes', 'x', '1'].indexOf(active) >= 0;
    if (!type || !name || !isActive) return;

    const key = normalizeText_(type) + '|' + normalizeText_(name);
    if (seen[key]) return;
    seen[key] = true;
    result.push({ type: type, name: name });
  });

  return result.sort(function(a, b) {
    const ta = normalizeText_(a.type) + '|' + normalizeText_(a.name);
    const tb = normalizeText_(b.type) + '|' + normalizeText_(b.name);
    return ta.localeCompare(tb, 'vi');
  });
}

/**********************
 * HÀM TỔNG HỢP
 **********************/
function sumReports_(reports) {
  return reports.reduce(function(t, r) {
    t.propaganda += r.propaganda;
    t.participants += r.participants;
    t.supportMoney += r.supportMoney;
    t.supportedHouseholds += r.supportedHouseholds;
    t.models += r.models;
    t.totalDebt += r.totalDebt;
    t.borrowerHouseholds += r.borrowerHouseholds;
    t.disbursement += r.disbursement;
    t.recovery += r.recovery;
    t.overdue += r.overdue;
    return t;
  }, {
    propaganda: 0,
    participants: 0,
    supportMoney: 0,
    supportedHouseholds: 0,
    models: 0,
    totalDebt: 0,
    borrowerHouseholds: 0,
    disbursement: 0,
    recovery: 0,
    overdue: 0
  });
}

function groupCount_(arr, keyFn) {
  const obj = {};
  arr.forEach(function(item) {
    const key = keyFn(item) || 'Chưa xác định';
    obj[key] = (obj[key] || 0) + 1;
  });
  return obj;
}

function objectToRows_(obj) {
  return Object.keys(obj).sort(function(a, b) {
    if (obj[b] !== obj[a]) return obj[b] - obj[a];
    return a.localeCompare(b, 'vi');
  }).map(function(k) { return [k, obj[k]]; });
}

/**********************
 * TIỆN ÍCH
 **********************/
function getOrCreateSheet_(ss, name) {
  let sh = ss.getSheetByName(name);
  if (!sh) sh = ss.insertSheet(name);
  return sh;
}

function findHeader_(headers, target) {
  const exact = headers.indexOf(target);
  if (exact >= 0) return exact;

  const t = normalizeText_(target);
  for (let i = 0; i < headers.length; i++) {
    if (normalizeText_(headers[i]) === t) return i;
  }
  for (let i = 0; i < headers.length; i++) {
    const h = normalizeText_(headers[i]);
    if (h.indexOf(t) >= 0 || t.indexOf(h) >= 0) return i;
  }
  return -1;
}

function normalizeText_(value) {
  return String(value == null ? '' : value)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, ' ')
    .trim();
}

function text_(value) {
  return String(value == null ? '' : value).trim();
}

function number_(value) {
  if (value === null || value === '' || value === undefined) return 0;
  if (typeof value === 'number') return isFinite(value) ? value : 0;
  const s = String(value).replace(/[^0-9-]/g, '');
  if (!s || s === '-') return 0;
  const n = Number(s);
  return isFinite(n) ? n : 0;
}

function safeDate_(value) {
  if (value instanceof Date && !isNaN(value.getTime())) return value;
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function normalizeMonth_(value, fallbackDate) {
  if (value instanceof Date && !isNaN(value.getTime())) return monthKey_(value);
  const s = text_(value);
  let m = s.match(/(\d{1,2})\s*[\/-]\s*(\d{4})/);
  if (m) return String(m[1]).padStart(2, '0') + '/' + m[2];
  m = s.match(/(\d{4})\s*[\/-]\s*(\d{1,2})/);
  if (m) return String(m[2]).padStart(2, '0') + '/' + m[1];
  if (fallbackDate instanceof Date && !isNaN(fallbackDate.getTime())) return monthKey_(fallbackDate);
  return '';
}

function monthKey_(date) {
  return String(date.getMonth() + 1).padStart(2, '0') + '/' + date.getFullYear();
}

function sortMonth_(a, b) {
  const pa = a.split('/');
  const pb = b.split('/');
  return Number(pa[1] + pa[0].padStart(2, '0')) - Number(pb[1] + pb[0].padStart(2, '0'));
}

function makeUnitKey_(month, type, name) {
  return normalizeText_(month) + '|' + normalizeText_(type) + '|' + normalizeText_(name);
}

function unique_(arr) {
  const out = [];
  const seen = {};
  arr.forEach(function(v) {
    if (seen[v]) return;
    seen[v] = true;
    out.push(v);
  });
  return out;
}

function readSelectedMonth_(sh) {
  if (!sh || sh.getLastRow() < 4) return '';
  return normalizeMonth_(sh.getRange('B4').getDisplayValue(), null);
}

/**********************
 * TRIGGER TỰ ĐỘNG
 **********************/
function caiDatTriggersTK_(ss) {
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    const fn = trigger.getHandlerFunction();
    if (fn === 'onFormSubmit') ScriptApp.deleteTrigger(trigger);
  });

  ScriptApp.newTrigger('onFormSubmit')
    .forSpreadsheet(ss)
    .onFormSubmit()
    .create();
}

function notify_(message) {
  try {
    SpreadsheetApp.getUi().alert(message);
  } catch (err) {
    console.log(message);
  }
}

/**********************
 * ĐỊNH DẠNG
 **********************/
function writeKpi_(sh, rangeA1, title, value, numberFormat) {
  const range = sh.getRange(rangeA1);
  range.breakApart();

  const row = range.getRow();
  const col = range.getColumn();
  const rows = range.getNumRows();
  const cols = range.getNumColumns();

  const titleRange = sh.getRange(row, col, 1, cols);
  const valueRange = sh.getRange(row + rows - 1, col, 1, cols);

  titleRange.merge();
  valueRange.merge();

  titleRange.setValue(title);
  titleRange.setFontWeight('bold').setFontSize(10).setHorizontalAlignment('center').setVerticalAlignment('middle');

  valueRange.setValue(value === null ? '—' : value);
  valueRange.setFontWeight('bold').setFontSize(16).setHorizontalAlignment('center').setVerticalAlignment('middle');
  if (numberFormat && value !== null) valueRange.setNumberFormat(numberFormat);

  range.setBorder(true, true, true, true, true, true);
}

function styleHeader_(range) {
  range.setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(true)
    .setBackground('#D9EAF7')
    .setBorder(true, true, true, true, true, true);
}

function styleDashboard_(sh, maxRow) {
  sh.getRange('A1:L' + maxRow).setFontFamily('Arial');
  sh.getRange('A1:L2').setBackground('#1F4E78').setFontColor('#FFFFFF');
  sh.getRange('A4:E4').setBackground('#D9EAF7');
  sh.getRange('A13:L13').setBackground('#D9EAF7');
  sh.getRange('A27:L27').setBackground('#D9EAF7');
  sh.getRange('A1:L' + maxRow).setWrap(true).setVerticalAlignment('middle');

  for (let c = 1; c <= 12; c++) sh.setColumnWidth(c, 110);
  sh.setColumnWidth(1, 195);
  sh.setColumnWidth(2, 115);
  sh.setColumnWidth(4, 195);
  sh.setColumnWidth(5, 115);
  sh.setColumnWidth(7, 220);
  sh.setColumnWidth(8, 150);
  sh.setColumnWidth(10, 150);
  sh.setColumnWidth(12, 150);
}


/************************************************************
 * WEB APP - GIAO DIỆN THEO DÕI BÁO CÁO
 * Tách giao diện sang Index.html.
 ************************************************************/
function doGet(e) {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Theo dõi báo cáo MTTQ xã Vệ Giang')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function getWebAppBootstrap() {
  const ss = getSpreadsheet_();
  const data = getDataTK_(ss);
  const reports = data.reports;
  const expected = getExpectedUnits_(ss);
  const currentMonth = monthKey_(new Date());
  const months = unique_(reports.map(function(r) { return r.month; }).filter(Boolean));
  const allMonths = unique_([currentMonth].concat(months)).sort(sortMonth_).reverse();
  return {
    months: allMonths,
    unitTypes: unique_(expected.map(function(u) { return u.type; }).concat(reports.map(function(r) { return r.unitType; }))).filter(Boolean).sort(function(a,b){ return a.localeCompare(b,'vi'); }),
    units: expected,
    currentMonth: currentMonth
  };
}

function getWebAppData(filters) {
  filters = filters || {};
  const month = normalizeMonth_(filters.month || '', null) || monthKey_(new Date());
  const unitType = text_(filters.unitType || '');
  const unitName = text_(filters.unitName || '');
  const ss = getSpreadsheet_();
  const data = getDataTK_(ss);
  const allReports = data.reports;
  const reports = allReports.filter(function(r) {
    if (r.month !== month) return false;
    if (unitType && normalizeText_(r.unitType) !== normalizeText_(unitType)) return false;
    if (unitName && normalizeText_(r.unitName) !== normalizeText_(unitName)) return false;
    return true;
  });
  const monthReports = allReports.filter(function(r) { return r.month === month; });
  const expected = getExpectedUnits_(ss);
  const submittedMap = {};
  monthReports.forEach(function(r) {
    submittedMap[normalizeText_(r.unitType) + '|' + normalizeText_(r.unitName)] = r;
  });
  const progress = expected.map(function(u) {
    const r = submittedMap[normalizeText_(u.type) + '|' + normalizeText_(u.name)];
    return {
      type: u.type,
      name: u.name,
      status: r ? 'Đã gửi' : 'Chưa gửi',
      timestamp: r && r.timestamp ? Utilities.formatDate(r.timestamp, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm') : '',
      reporter: r ? r.reporter : '',
      phone: r ? r.phone : '',
      sourceRow: r ? r.sourceRow : ''
    };
  });
  const totals = sumReports_(monthReports);
  const sentCount = progress.filter(function(x) { return x.status === 'Đã gửi'; }).length;
  const missingCount = progress.length - sentCount;
  const typeStats = objectToRows_(groupCount_(monthReports, function(r){return r.unitType;})).map(function(x){return {label:x[0],value:x[1]};});
  const unitStats = objectToRows_(groupCount_(monthReports, function(r){return r.unitName;})).map(function(x){return {label:x[0],value:x[1]};});
  const monthStats = unique_(allReports.map(function(r){return r.month;}).filter(Boolean)).sort(sortMonth_).map(function(m){
    return {label:m,value:allReports.filter(function(r){return r.month===m;}).length};
  });
  const monthlyRows = unique_(allReports.map(function(r) { return r.month; }).filter(Boolean)).sort(sortMonth_).map(function(m) {
    const rs = allReports.filter(function(r) { return r.month === m; });
    const t = sumReports_(rs);
    const units = {};
    rs.forEach(function(r) { units[makeUnitKey_(m, r.unitType, r.unitName)] = true; });
    return {
      month: m, reports: rs.length, units: Object.keys(units).length,
      propaganda: t.propaganda, participants: t.participants, supportMoney: t.supportMoney,
      supportedHouseholds: t.supportedHouseholds, models: t.models, totalDebt: t.totalDebt,
      borrowerHouseholds: t.borrowerHouseholds, disbursement: t.disbursement,
      recovery: t.recovery, overdue: t.overdue
    };
  });
  const reportObjects = reports.map(webSafeReport_);
  return {
    month: month,
    totals: totals,
    kpi: {
      totalReports: monthReports.length,
      expected: expected.length,
      sent: sentCount,
      missing: missingCount,
      rate: expected.length ? Math.round((sentCount / expected.length) * 1000) / 10 : null
    },
    typeStats: typeStats,
    unitStats: unitStats,
    monthStats: monthStats,
    monthlyRows: monthlyRows,
    progress: progress,
    reports: reportObjects
  };
}

function webSafeReport_(r) {
  const out = {};
  Object.keys(r).forEach(function(k) {
    const v = r[k];
    if (v instanceof Date && !isNaN(v.getTime())) {
      out[k] = Utilities.formatDate(v, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
    } else {
      out[k] = v;
    }
  });
  return out;
}
