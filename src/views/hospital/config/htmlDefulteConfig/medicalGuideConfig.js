//医疗指南
const medicalGuideConfig =
  "\t<p>\n" +
  "\t\t<span style=\";font-family:Calibri;font-size:14px\"><span style=\"font-family:宋体\">门诊就医须知</span></span>\n" +
  "\t</p>\n" +
  "\t<p>\n" +
  "\t\t<span style=\";font-family:Calibri;font-size:14px\"><span style=\"font-family:宋体\">尊敬的患者及家属：</span></span>\n" +
  "\t</p>\n" +
  "\t<p>\n" +
  "\t\t<span style=\";font-family:宋体;font-size:14px\"><span style=\"font-family:Calibri\">XXX</span></span><span style=\";font-family:Calibri;font-size:14px\"><span style=\"font-family:宋体\">医院全体医务人员愿为您提供最优质的服务和高质量的医疗技术，为方便您的就医，现将门诊基本情况介绍如下：</span></span>\n" +
  "\t</p>\n" +
  "\t<p>\n" +
  "\t\t<span style=\";font-family:Calibri;font-size:14px\">1<span style=\"font-family:宋体\">、门诊挂号时间：</span></span>\n" +
  "\t</p>\n" +
  "\t<p>\n" +
  "\t\t<span style=\";font-family:Calibri;font-size:14px\"><span style=\"font-family:宋体\">上午</span>7:30—11:20<span style=\"font-family:宋体\">；下午</span><span style=\"font-family:Calibri\">13:30—17:50</span><span style=\"font-family:宋体\">（冬季</span><span style=\"font-family:Calibri\">13:00—17:20</span><span style=\"font-family:宋体\">）</span></span>\n" +
  "\t</p>\n" +
  "\t<p>\n" +
  "\t\t<span style=\";font-family:Calibri;font-size:14px\"><span style=\"font-family:宋体\">门诊开诊时间：</span></span>\n" +
  "\t</p>\n" +
  "\t<p>\n" +
  "\t\t<span style=\";font-family:Calibri;font-size:14px\"><span style=\"font-family:宋体\">普通门诊：上午</span>8:00—11:30<span style=\"font-family:宋体\">；</span></span>\n" +
  "\t</p>\n" +
  "\t<p>\n" +
  "\t\t<span style=\";font-family:Calibri;font-size:14px\"><span style=\"font-family:宋体\">下午</span>14:00—18:00<span style=\"font-family:宋体\">（冬季</span><span style=\"font-family:Calibri\">13:30—17:30</span><span style=\"font-family:宋体\">）</span></span>\n" +
  "\t</p>\n" +
  "\t<p>\n" +
  "\t\t<span style=\";font-family:Calibri;font-size:14px\"><span style=\"font-family:宋体\">专家门诊：上午</span>8:15—11:30<span style=\"font-family:宋体\">；</span></span>\n" +
  "\t</p>\n" +
  "\t<p>\n" +
  "\t\t<span style=\";font-family:Calibri;font-size:14px\"><span style=\"font-family:宋体\">下午</span>14:00—18<span style=\"font-family:宋体\">：</span><span style=\"font-family:Calibri\">00</span><span style=\"font-family:宋体\">（夏季</span><span style=\"font-family:Calibri\">15:00—18:00</span><span style=\"font-family:宋体\">；冬季</span><span style=\"font-family:Calibri\">13:30—17:30</span><span style=\"font-family:宋体\">）</span></span>\n" +
  "\t</p>\n" +
  "\t<p>\n" +
  "\t\t<span style=\";font-family:Calibri;font-size:14px\">2<span style=\"font-family:宋体\">、就诊日请患者携带本人身份证、社保卡（或有效证件）在预约挂号时间前来我院取号缴费，取号后请到门诊各诊区的签到机上签到，等候电子屏叫号就诊。</span></span>\n" +
  "\t</p>\n" +
  "\t<p>\n" +
  "\t\t<span style=\";font-family:Calibri;font-size:14px\">3<span style=\"font-family:宋体\">、按照国家规定，门诊挂号当天有效，第二天需重新挂号。</span></span>\n" +
  "\t</p>\n" +
  "\t<p>\n" +
  "\t\t<span style=\";font-family:Calibri;font-size:14px\"><span style=\"font-family:宋体\">（</span>1<span style=\"font-family:宋体\">）上午挂号一般上午看，若推迟到下午须由分诊护士安排延后就诊。</span></span>\n" +
  "\t</p>\n" +
  "\t<p>\n" +
  "\t\t<span style=\";font-family:Calibri;font-size:14px\"><span style=\"font-family:宋体\">（</span>2<span style=\"font-family:宋体\">）普通门诊挂号就诊后，如第二天出检查报告，可以不再挂号，重新签到叫号；若到第三天，必须重新挂号。挂号当天已开具处方的，第二天需重新挂号。</span></span>\n" +
  "\t</p>\n" +
  "\t<p>\n" +
  "\t\t<span style=\";font-family:Calibri;font-size:14px\"><span style=\"font-family:宋体\">（</span>3<span style=\"font-family:宋体\">）专家门诊挂号为当天当次门诊有效，全天专家当天均有效</span><span style=\"font-family:Calibri\">,</span><span style=\"font-family:宋体\">下次就诊须重新挂号。仅上午半天专家门诊的，下午普通门诊医生有义务负责查看医技检查报告并告知患者诊断结果，如需配药，患者须重新挂普通号。</span></span>\n" +
  "\t</p>\n" +
  "\t<p>\n" +
  "\t\t<span style=\";font-family:Calibri;font-size:14px\"><span style=\"font-family:宋体\">（</span>4<span style=\"font-family:宋体\">）普通门诊因检查出报告超过挂号第二天晚</span><span style=\"font-family:Calibri\">24</span><span style=\"font-family:宋体\">时，不论后续是配药还是看报告，患者必须重新挂号排队候诊。</span></span>\n" +
  "\t</p>\n" +
  "\t<p>\n" +
  "\t\t<span style=\";font-family:Calibri;font-size:14px\">4<span style=\"font-family:宋体\">、专家出门诊时间基本是固定的，由于专家同时承担着教学、院外会诊、重大突发事件的紧急处理等任务需临时停诊。如停诊，医院会推送短信通知到您的手机上（就诊卡内的电话号码），请您关注。</span></span>\n" +
  "\t</p>\n" +
  "\t<p>\n" +
  "\t\t<span style=\";font-family:Calibri;font-size:14px\">5<span style=\"font-family:宋体\">、门诊检验科采血时间：</span></span>\n" +
  "\t</p>\n" +
  "\t<p>\n" +
  "\t\t<span style=\";font-family:Calibri;font-size:14px\"><span style=\"font-family:宋体\">星期一</span><span style=\"font-family:Calibri\">—</span><span style=\"font-family:宋体\">星期日：</span><span style=\"font-family:Calibri\">7:00—11:30,14:00—18:00</span><span style=\"font-family:宋体\">（冬季</span><span style=\"font-family:Calibri\">13:30—17:30</span><span style=\"font-family:宋体\">）</span></span>\n" +
  "\t</p>\n" +
  "\t<p>\n" +
  "\t\t<span style=\";font-family:Calibri;font-size:14px\"><span style=\"font-family:宋体\">其余时间请到</span>B<span style=\"font-family:宋体\">楼</span><span style=\"font-family:Calibri\">1</span><span style=\"font-family:宋体\">层急诊检验科。</span></span>\n" +
  "\t</p>\n" +
  "\t<p>\n" +
  "\t\t<span style=\";font-family:Calibri;font-size:14px\"><span style=\"font-family:宋体\">检验结果查询：患者持身份证、医保卡或条形码在院内自助机上打印检验报告，或通过医院微信公众号上查询；部分检验报告需到人工窗口打印，地点是门诊一楼大厅一站式服务中心。</span></span>\n" +
  "\t</p>\n" +
  "\t<p>\n" +
  "\t\t<span style=\";font-family:Calibri;font-size:14px\">6<span style=\"font-family:宋体\">、取药：门诊患者缴费后，应根据缴费单上提示的内容，到一楼大厅门诊药房指定窗口取药，取药时间</span><span style=\"font-family:Calibri\">8:00—12:00,14:00—18:30</span><span style=\"font-family:宋体\">（冬季</span><span style=\"font-family:Calibri\">13:30—18:00</span><span style=\"font-family:宋体\">），其余时间可至急诊药房取药。中草药需在门诊缴费后，凭缴费单至医院右侧存仁堂药房取中草药。</span></span>\n" +
  "\t</p>\n" +
  "\t<p>\n" +
  "\t\t<span style=\";font-family:Calibri;font-size:14px\">7<span style=\"font-family:宋体\">、缴费：门诊楼各楼层均有收费窗口，患者也可持银行卡、支付宝、微信在院内自助机上缴费。患者缴费后，如需要发票，缴费</span><span style=\"font-family:Calibri\">7</span><span style=\"font-family:宋体\">天内可在自助发票打印机上打印或门诊任意窗口打印，</span><span style=\"font-family:Calibri\">7</span><span style=\"font-family:宋体\">天后至</span><span style=\"font-family:Calibri\">4</span><span style=\"font-family:宋体\">个月内的发票可在自助发票打印机打印。</span></span>\n" +
  "\t</p>\n" +
  "\t<p>\n" +
  "\t\t<span style=\";font-family:Calibri;font-size:14px\">8<span style=\"font-family:宋体\">、开具休假证明书须知</span></span>\n" +
  "\t</p>\n" +
  "\t<p>\n" +
  "\t\t<span style=\";font-family:Calibri;font-size:14px\"><span style=\"font-family:宋体\">（</span>1<span style=\"font-family:宋体\">）《医疗诊断证明书》原则上不写明休息时间，符合</span><span style=\"font-family:Calibri\">“</span><span style=\"font-family:宋体\">建议休息</span><span style=\"font-family:Calibri\">”</span><span style=\"font-family:宋体\">的病人，仅在诊断证明书中写明</span><span style=\"font-family:Calibri\">“</span><span style=\"font-family:宋体\">建议休息</span><span style=\"font-family:Calibri\">”</span><span style=\"font-family:宋体\">，具体是否休息应由病人所在单位和个人共同决定，单位可根据病人情况调整工种或安排休息。</span></span>\n" +
  "\t</p>\n" +
  "\t<p>\n" +
  "\t\t<span style=\";font-family:Calibri;font-size:14px\"><span style=\"font-family:宋体\">（</span>2<span style=\"font-family:宋体\">）因工伤、交通事故、意外伤害等公安部门或保险公司要求开具休息时间，根据病情，原则上急诊内科不超过三天，急诊外科不超过两周，仅门诊治疗的不超过一周，住院治疗的病人不超过三月，超过时限仍需休息的病人应再次到医院开具，建议休息时间应从前次建休截至时间开始计算或从本次开具时间开始计算。</span></span>\n" +
  "\t</p>\n" +
  "\t<p>\n" +
  "\t\t<span style=\";font-family:Calibri;font-size:14px\">&nbsp;</span>\n" +
  "\t</p>\n" +
  "\t<p>\n" +
  "\t\t<span style=\";font-family:Calibri;font-size:14px\">&nbsp;</span>\n" +
  "\t</p>\n" +
  "\t<p>\n" +
  "\t\t<span style=\";font-family:Calibri;font-size:14px\">&nbsp;</span>\n" +
  "\t</p>\n" +
  "\t<p >\n" +
  "\t\t<br/>\n" +
  "\t</p>\n";
export default medicalGuideConfig;