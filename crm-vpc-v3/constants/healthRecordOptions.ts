// constants/healthRecordOptions.ts

export const skinConditionOptions = [
  { label: 'Da bình thường', value: 'normal' },
  { label: 'Da khô', value: 'dry' },
  { label: 'Nổi mẩn đỏ', value: 'rash' },
  { label: 'Chàm sữa', value: 'eczema' },
  { label: 'Vàng da sinh lý', value: 'jaundice' },
  { label: 'Rôm sảy', value: 'heat_rash' },
  { label: 'Viêm da tiết bã', value: 'seborrheic_dermatitis' },
  { label: 'Mụn sữa', value: 'milia' },
];

export const skinConditionNoteOptions = [
  { label: 'Bình thường', value: 'normal' },
  { label: 'Cần theo dõi', value: 'monitor' },
  { label: 'Đang điều trị', value: 'treating' },
];

// Sức khỏe răng miệng options (0-20 răng)
export const oralHealthOptions = [
  { label: '0 răng', value: '0_teeth' },
  { label: '1 răng', value: '1_teeth' },
  { label: '2 răng', value: '2_teeth' },
  { label: '3 răng', value: '3_teeth' },
  { label: '4 răng', value: '4_teeth' },
  { label: '5 răng', value: '5_teeth' },
  { label: '6 răng', value: '6_teeth' },
  { label: '7 răng', value: '7_teeth' },
  { label: '8 răng', value: '8_teeth' },
  { label: '9 răng', value: '9_teeth' },
  { label: '10 răng', value: '10_teeth' },
  { label: '11 răng', value: '11_teeth' },
  { label: '12 răng', value: '12_teeth' },
  { label: '13 răng', value: '13_teeth' },
  { label: '14 răng', value: '14_teeth' },
  { label: '15 răng', value: '15_teeth' },
  { label: '16 răng', value: '16_teeth' },
  { label: '17 răng', value: '17_teeth' },
  { label: '18 răng', value: '18_teeth' },
  { label: '19 răng', value: '19_teeth' },
  { label: '20 răng', value: '20_teeth' },
];

// Ghi chú sức khỏe răng miệng options
export const oralHealthNoteOptions = [
  { label: 'Tưa lưỡi/Nấm miệng', value: 'oral_thrush' },
  { label: 'Viêm nướu', value: 'gingivitis' },
  { label: 'Hôi miệng', value: 'bad_breath' },
];

// Dinh dưỡng options
export const nutritionOptions = [
  { label: 'Sữa mẹ', value: 'breast_milk' },
  { label: 'Sữa công thức', value: 'formula' },
  { label: 'Ăn dặm', value: 'solid_food' },
  { label: 'Sữa mẹ + Sữa công thức', value: 'breast_milk_formula' },
  { label: 'Ăn dặm + Sữa công thức', value: 'solid_food_formula' },
  { label: 'Ăn dặm + Sữa mẹ', value: 'solid_food_breast_milk' },
  { label: 'Ăn dặm + Sữa mẹ + Sữa công thức', value: 'solid_food_breast_milk_formula' },
];

// Ghi chú dinh dưỡng options
export const nutritionNoteOptions = [
  { label: 'Ăn bình thường', value: 'normal' },
  { label: 'Ăn ít', value: 'eat_less' },
  { label: 'Ăn nhiều', value: 'eat_more' },
  { label: 'Chán ăn', value: 'loss_appetite' },
  { label: 'Bỏ ăn', value: 'refuse_eat' },
];

// Giấc ngủ options
export const sleepOptions = [
  { label: '1 cữ ngủ/ngày', value: '1_nap' },
  { label: '2 cữ ngủ/ngày', value: '2_naps' },
  { label: '3 cữ ngủ/ngày', value: '3_naps' },
  { label: '4 cữ ngủ/ngày', value: '4_naps' },
  { label: '5 cữ ngủ/ngày', value: '5_naps' },
  { label: '6 cữ ngủ/ngày', value: '6_naps' },
];

// Ghi chú giấc ngủ options
export const sleepNoteOptions = [
  { label: 'Ngủ vặt', value: 'short_naps' },
  { label: 'Ngủ khó vào giấc', value: 'hard_to_sleep' },
  { label: 'Không chuyển giấc được', value: 'cant_transition' },
  { label: 'Ngủ hay giật mình', value: 'startled_sleep' },
  { label: 'Ngủ li bì', value: 'drowsy' },
  { label: 'Ngủ đủ giấc', value: 'enough_sleep' },
];

// Tần suất đại tiện options
export const stoolFrequencyOptions = [
  { label: '0 lần/ngày', value: '0_per_day' },
  { label: '1-2 lần/ngày', value: '1-2_per_day' },
  { label: '3-4 lần/ngày', value: '3-4_per_day' },
  { label: '5+ lần/ngày', value: '5+_per_day' },
];

export const stoolConditionOptions = [
  { label: 'Cứng', value: 'hard' },
  { label: 'Đặc', value: 'thick' },
  { label: 'Mềm', value: 'soft' },
  { label: 'Lỏng', value: 'loose' },
  { label: 'Bọt', value: 'foamy' },
  { label: 'Nhầy', value: 'mucous' },
];

// Vấn đề tiêu hóa options
export const digestiveIssuesOptions = [
  { label: 'Táo bón', value: 'constipation' },
  { label: 'Tiêu chảy', value: 'diarrhea' },
  { label: 'Trào ngược', value: 'reflux' },
  { label: 'Đầy hơi', value: 'bloating' },
  { label: 'Nôn', value: 'vomiting' },
  { label: 'Trớ', value: 'spitting_up' },
  { label: 'Cặn sữa', value: 'milk_residue' },
];

// Lịch sinh hoạt options
export const scheduleOptions = [
  { label: 'EASY 3', value: 'easy_3' },
  { label: 'EASY 3.5', value: 'easy_3_5' },
  { label: 'EASY 4', value: 'easy_4' },
  { label: 'EASY 2-3-4', value: 'easy_2_3_4' },
  { label: 'EASY 5-6', value: 'easy_5_6' },
  { label: 'Khác', value: 'other' },
];

export const methodOptions = [
  { label: 'EASY 3', value: 'easy_3' },
  { label: 'EASY 3.5', value: 'easy_3_5' },
  { label: 'EASY 4', value: 'easy_4' },
  { label: 'EASY 2-3-4', value: 'easy_2_3_4' },
  { label: 'EASY 5-6', value: 'easy_5_6' },
  { label: 'Khác', value: 'other' },
];

// Mốc phát triển options
export const developmentMilestoneOptions = [
  { label: '0-2 tháng', value: '0-2_months' },
  { label: '3-5 tháng', value: '3-5_months' },
  { label: '7-9 tháng', value: '7-9_months' },
  { label: '10-12 tháng', value: '10-12_months' },
  { label: '13-18 tháng', value: '13-18_months' },
  { label: '19-24 tháng', value: '19-24_months' },
];

export const motorSkillsOptions = [
  { label: 'Bé bò, ngồi, vỗ, dũng', value: 'crawling_sitting' },
  { label: 'Đi được', value: 'walking' },
  { label: 'Chạy được', value: 'running' },
  { label: 'Leo trèo được', value: 'climbing' },
  { label: 'Chậm phát triển', value: 'delayed' },
  { label: 'Khác', value: 'other' },
];

// Vận động thô
export const grossMotorSkillsOptions = [
  { label: 'Bé bò, ngồi, vỗ, dũng', value: 'crawling_sitting' },
  { label: 'Cơ bản', value: 'basic' },
  { label: 'Nâng đầu, ngực khi nằm sấp', value: 'lift_head' },
  { label: 'Giữ đầu ổn định khi bế', value: 'hold_head' },
  { label: 'Lật', value: 'roll' },
  { label: 'Ngồi', value: 'sit' },
  { label: 'Bò', value: 'crawl' },
  { label: 'Đứng', value: 'stand' },
  { label: 'Đi', value: 'walk' },
  { label: 'Chạy', value: 'run' },
  { label: 'Khác', value: 'other' },
];

// Vận động tĩnh
export const fineMotorSkillsOptions = [
  { label: 'Cơ bản', value: 'basic' },
  { label: 'Mở bàn tay thả lỏng', value: 'open_hand' },
  { label: 'Nắm ngón tay người lớn', value: 'grasp_finger' },
  { label: 'Đưa tay lên miệng', value: 'hand_to_mouth' },
  { label: 'Cầm đồ vật', value: 'hold_object' },
  { label: 'Chuyền tay', value: 'transfer' },
  { label: 'Nhặt đồ nhỏ', value: 'pick_small' },
  { label: 'Khác', value: 'other' },
];

// Thị giác và nhận thức
export const visualCognitionOptions = [
  { label: 'Cơ bản', value: 'basic' },
  { label: 'Nhìn chăm chú người/đồ chơi', value: 'stare' },
  { label: 'Nhìn vật di chuyển', value: 'track_object' },
  { label: 'Nhận biết người quen', value: 'recognize_people' },
  { label: 'Tìm đồ vật bị giấu', value: 'find_hidden' },
  { label: 'Khác', value: 'other' },
];

// Giao tiếp và cảm xúc
export const communicationEmotionOptions = [
  { label: 'Cơ bản', value: 'basic' },
  { label: 'Hóng chuyện, phát ra âm thanh gù gù', value: 'cooing' },
  { label: 'Cười đáp lại', value: 'smile_back' },
  { label: 'Bập bẹ', value: 'babble' },
  { label: 'Nói từ đơn', value: 'single_words' },
  { label: 'Nói câu ngắn', value: 'short_sentences' },
  { label: 'Khác', value: 'other' },
];

// Dấu hiệu cảnh báo sớm
export const earlyWarningOptions = [
  { label: 'Không có', value: 'no_warning' },
  { label: 'Không có', value: 'none' },
  { label: 'Chân duỗi cứng khi bế lên', value: 'stiff_legs' },
  { label: 'Không phản ứng với âm thanh', value: 'no_sound_response' },
  { label: 'Không nhìn theo vật', value: 'no_tracking' },
  { label: 'Không cười', value: 'no_smile' },
  { label: 'Khác', value: 'other' },
];
