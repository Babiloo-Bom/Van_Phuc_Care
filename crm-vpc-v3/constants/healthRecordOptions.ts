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

// --- Detailed staged options (grouped by period) ---
export const grossMotorSkillsStages = [
  {
    period: '0-3 tháng',
    options: [
      { label: 'Nâng đầu/ngực khi nằm sấp', value: 'lift_head_chest' },
      { label: 'Chuyển động chân tay nhịp nhàng', value: 'rhythmic_movement' },
      { label: 'Giữ đầu ổn định hơn khi được bế', value: 'hold_head_stable' },
    ],
  },
  {
    period: '4-6 tháng',
    options: [
      { label: 'Lật thành thạo', value: 'roll_mastery' },
      { label: 'Bắt đầu tập ngồi', value: 'start_sitting' },
      { label: 'Có thể tự ngồi 2-5p', value: 'sit_independent_2_5min' },
    ],
  },
  {
    period: '7-9 tháng',
    options: [
      { label: 'Bắt đầu biết bò -> thành thạo', value: 'crawl_start_mastery' },
      { label: 'Vịn tường, thành giường đứng dậy', value: 'pull_to_stand' },
    ],
  },
  {
    period: '10-12 tháng',
    options: [
      { label: 'Bắt đầu tập đi, đi men', value: 'start_walking_cruising' },
      { label: 'Đứng độc lập được vài giây', value: 'stand_independent_seconds' },
    ],
  },
  {
    period: '13-18 tháng',
    options: [
      { label: 'Bắt đầu đi vững, ít ngã, có thể chạy', value: 'walk_steady_run' },
      { label: 'Tự xúc đồ ăn, vẫn còn rơi vãi', value: 'self_feed_spill' },
      { label: 'Cầm cốc uống thành thạo', value: 'cup_drinking_mastery' },
    ],
  },
  {
    period: '19-24 tháng',
    options: [
      { label: 'Chạy vững vàng', value: 'run_steady' },
      { label: 'Lên xuống cầu thang', value: 'stairs_up_down' },
      { label: 'Biết đá bóng', value: 'kick_ball' },
      { label: 'Biết bật chân lên khỏi mặt đất', value: 'jump_off_ground' },
    ],
  },
];

export const fineMotorSkillsStages = [
  {
    period: '0-3 tháng',
    options: [
      { label: 'Mở bàn tay thả lỏng', value: 'open_hand_relaxed' },
      { label: 'Phản xạ nắm', value: 'grasp_reflex' },
      { label: 'Đưa tay lên miệng', value: 'hand_to_mouth' },
    ],
  },
  {
    period: '4-6 tháng',
    options: [
      { label: 'Thành thạo cầm nắm', value: 'grasp_mastery' },
      { label: 'Chuyển đồ vật từ tay này qua tay khác/cho vào mồm', value: 'transfer_to_mouth' },
      { label: 'Khám phá đồ vật bằng miệng', value: 'explore_with_mouth' },
    ],
  },
  {
    period: '7-9 tháng',
    options: [
      { label: 'Cầm nắm thành thạo hơn', value: 'grasp_more_mastery' },
      { label: 'Sử dụng ngón cái ngón trỏ nhặt vật nhỏ', value: 'pincer_grasp' },
      { label: 'Đập 2 vật vào nhau', value: 'bang_objects' },
    ],
  },
  {
    period: '10-12 tháng',
    options: [
      { label: 'Hiểu công dụng đồ vật', value: 'understand_object_use' },
    ],
  },
  {
    period: '13-18 tháng',
    options: [
      { label: 'Bắt đầu biết giả vờ bắt chước người lớn', value: 'pretend_imitate' },
    ],
  },
  {
    period: '19-24 tháng',
    options: [
      { label: 'Phân loại hình dạng và màu sắc', value: 'sort_shapes_colors' },
      { label: 'Bắt đầu biết tô màu', value: 'start_coloring' },
    ],
  },
];

export const visualCognitionStages = [
  {
    period: '0-3 tháng',
    options: [
      { label: 'Nhìn theo vật di chuyển từ trái sang phải', value: 'track_left_right' },
      { label: 'Nhìn chăm chú vào khuôn mặt người chăm sóc', value: 'stare_caregiver_face' },
    ],
  },
  {
    period: '4-6 tháng',
    options: [
      { label: 'Lấy đồ có chủ đích', value: 'intentional_reach' },
      { label: 'Sử dụng bàn tay lấy vật nhỏ', value: 'hand_grasp_small' },
    ],
  },
  {
    period: '7-9 tháng',
    options: [
      { label: 'Nhận biết sự tồn tại của đồ vật, thích chơi ú òa', value: 'object_permanence_peekaboo' },
      { label: 'Nhìn theo vật rơi xuống đất', value: 'track_falling_object' },
    ],
  },
  {
    period: '10-12 tháng',
    options: [
      { label: 'Tìm đồ vật bị giấu', value: 'find_hidden_object' },
      { label: 'Bắt chước hành động người khác', value: 'imitate_actions' },
      { label: 'Cho đồ vào hộp rồi lấy ra', value: 'put_take_out_box' },
    ],
  },
  {
    period: '13-18 tháng',
    options: [
      { label: 'Hiểu ngôn ngữ và chỉ dẫn đơn giản', value: 'understand_simple_instructions' },
    ],
  },
  {
    period: '19-24 tháng',
    options: [
      { label: 'Tương tác với người xung quanh nhưng chưa hòa đồng', value: 'interact_not_social' },
      { label: 'Muốn tự làm mọi thứ, không làm được sẽ ăn vạ', value: 'want_independence_tantrum' },
    ],
  },
];

export const communicationEmotionStages = [
  {
    period: '0-3 tháng',
    options: [
      { label: 'Nụ cười xã hội', value: 'social_smile' },
      { label: 'Hóng chuyện, phát ra âm thanh gù gù', value: 'cooing_sounds' },
      { label: 'Bình tĩnh lại khi được bế hoặc nói chuyện', value: 'calm_when_held_talked' },
    ],
  },
  {
    period: '4-6 tháng',
    options: [
      { label: 'Bập bẹ các âm tiết đơn giản', value: 'babble_simple_syllables' },
    ],
  },
  {
    period: '7-9 tháng',
    options: [
      { label: 'Hiểu được từ không', value: 'understand_no' },
      { label: 'Bắt chước âm thanh cử chỉ', value: 'imitate_sounds_gestures' },
      { label: 'Nói bập bẹ chuỗi dài hơn', value: 'longer_babble' },
    ],
  },
  {
    period: '10-12 tháng',
    options: [
      { label: 'Bắt đầu nói đc từ đơn', value: 'start_single_words' },
      { label: 'Giao tiếp bằng cử chỉ (vẫy tay, lắc đầu,...)', value: 'gesture_communication' },
    ],
  },
  {
    period: '13-18 tháng',
    options: [
      { label: 'Giai đoạn bùng nổ ngôn ngữ (nói đc 3-20 từ đơn)', value: 'language_explosion' },
      { label: 'Hiểu mệnh lệnh đơn giản', value: 'understand_simple_commands' },
    ],
  },
  {
    period: '19-24 tháng',
    options: [
      { label: 'Ghép từ và câu ngắn', value: 'combine_words_short_sentences' },
      { label: 'Vốn từ vựng ~50 từ', value: 'vocabulary_50_words' },
      { label: 'Thể hiện sự ngang bướng', value: 'show_stubbornness' },
    ],
  },
];

export const earlyWarningStages = [
  {
    period: '0-3 tháng',
    options: [
      { label: 'Cổ quá mềm', value: 'neck_too_soft' },
      { label: 'Cứng cơ', value: 'muscle_stiffness' },
      { label: 'Không nhấc được đầu khi nằm sấp', value: 'cant_lift_head_tummy' },
      { label: 'Bàn tay nắm chặt liên tục sau 3 tháng tuổi', value: 'tight_fist_after_3months' },
      { label: 'Không cầm nắm vật đặt vào tay', value: 'no_grasp_object' },
      { label: 'Không nhìn theo vật chuyển động', value: 'no_track_moving_object' },
      { label: 'Không giao tiếp bằng mắt', value: 'no_eye_contact' },
      { label: 'Không cười với người khác sau 3 tháng', value: 'no_smile_after_3months' },
      { label: 'Không phản ứng với tiếng động lớn', value: 'no_response_loud_sound' },
      { label: 'Quấy khóc liên tục không thể dỗ dành', value: 'excessive_crying' },
    ],
  },
  {
    period: '4-6 tháng',
    options: [
      { label: 'Không lật được', value: 'cant_roll' },
      { label: 'Cơ thể quá mềm hoặc quá cứng', value: 'body_too_soft_or_stiff' },
      { label: 'Chỉ với tay bằng một bên (nguy cơ liệt nửa người hoặc tổn thương thần kinh)', value: 'one_hand_reach_only' },
      { label: 'Không cười, không phát ra âm thanh', value: 'no_smile_no_sound' },
    ],
  },
  {
    period: '7-9 tháng',
    options: [
      { label: 'Không thể ngồi vững', value: 'cant_sit_stable' },
      { label: 'Không dồn trọng lượng lên chân khi được bế đứng', value: 'no_weight_bearing_legs' },
      { label: 'Không bập bẹ', value: 'no_babbling' },
      { label: 'Không phản ứng khi được gọi tên', value: 'no_response_name' },
      { label: 'Không quan tâm đến đồ chơi', value: 'no_interest_toys' },
      { label: 'Không nhìn theo hướng chỉ tay của người lớn', value: 'no_follow_pointing' },
    ],
  },
  {
    period: '10-12 tháng',
    options: [],
  },
  {
    period: '13-18 tháng',
    options: [
      { label: 'Không chỉ ngón tay để thể hiện sự quan tâm', value: 'no_pointing_interest' },
      { label: 'Không chơi giả vờ', value: 'no_pretend_play' },
      { label: 'Không nhìn vào mắt người đối diện khi giao tiếp', value: 'no_eye_contact_communication' },
      { label: 'Mất đi kỹ năng đã có', value: 'loss_acquired_skills' },
    ],
  },
  {
    period: '19-24 tháng',
    options: [],
  },
];

// Flattened detailed option lists for label lookup
export const grossMotorSkillsDetailedOptions = grossMotorSkillsStages.flatMap((s) => s.options);
export const fineMotorSkillsDetailedOptions = fineMotorSkillsStages.flatMap((s) => s.options);
export const visualCognitionDetailedOptions = visualCognitionStages.flatMap((s) => s.options);
export const communicationEmotionDetailedOptions = communicationEmotionStages.flatMap((s) => s.options);
export const earlyWarningDetailedOptions = earlyWarningStages.flatMap((s) => s.options);

