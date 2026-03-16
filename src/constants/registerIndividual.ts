/** 学历选项 */
export const EDU_COLUMNS = [
  { text: '小学', value: 'PRIMARY_SCHOOL' },
  { text: '初中', value: 'MIDDLE_SCHOOL' },
  { text: '高中', value: 'HIGH_SCHOOL' },
  { text: '大专', value: 'COLLEGE' },
  { text: '本科', value: 'BACHELOR' },
  { text: '硕士', value: 'MASTER' },
  { text: '博士', value: 'DOCTORATE' }
];

/** 政治面貌选项 */
export const POLITICAL_COLUMNS = [
  { text: '群众', value: 'MASSES' },
  { text: '党员', value: 'PARTY_MEMBER' },
  { text: '团员', value: 'LEAGUE_MEMBER' },
  { text: '其他', value: 'OTHER' }
];

/** 职业选项 */
export const OCCUPATIONAL_COLUMNS = [
  { text: '学生', value: 'STUDENT' },
  { text: '工人', value: 'WORKER' },
  { text: '农民', value: 'FARMER' },
  { text: '教师', value: 'TEACHER' },
  { text: '医生', value: 'DOCTOR' },
  { text: '其他', value: 'OTHER' }
];

/** 签约状态文案映射 */
export const STATUS_MAP: Record<string, string> = {
  submitted: '信息登记',
  first_signing: '首次签约',
  business_registration: '工商登记',
  wait_alipay_realname: '工商验证',
  second_signing: '二次签约',
  tax_registration: '税务登记',
  tax_agent_pending: '税务登记',
  completed: '已完成',
  failed: '签约失败',
  cancelled: '已取消',
  pending: '处理中',
  submit: '待审核',
  approved: '已审核',
  '': ''
};

/** 状态时间轴顺序（用于时间轴展示） */
export const STATUS_TIMELINE_ORDER: string[] = [
  'submitted',
  'business_registration',
  'wait_alipay_realname',
  'second_signing',
  'tax_registration',
  // 'completed'
];
