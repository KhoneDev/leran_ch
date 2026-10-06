export interface HskkQuestion {
	id: string;
	partNumber: number; // 1, 2, 3
	partTitleLao: string;
	partTitleCn: string;
	instructionLao: string;
	promptCn: string;
	promptPinyin: string;
	promptLao: string;
	audioPrompt: string; // text to speak via speechSynthesis
	prepTimeSec: number; // preparation timer
	answerTimeSec: number; // speaking timer
	modelAnswerCn: string;
	modelAnswerPinyin: string;
	modelAnswerLao: string;
	tipsLao: string;
	imageUrl?: string;
}

export interface HskkLevelData {
	id: 'primary' | 'intermediate' | 'advanced';
	nameLao: string;
	nameCn: string;
	targetHsk: string;
	totalTimeMin: number;
	passingScore: number;
	descriptionLao: string;
	parts: {
		partNumber: number;
		titleCn: string;
		titleLao: string;
		countInfo: string;
		timeInfo: string;
	}[];
	questions: HskkQuestion[];
}

export const HSKK_DATA: Record<'primary' | 'intermediate' | 'advanced', HskkLevelData> = {
	primary: {
		id: 'primary',
		nameLao: 'HSKK ລະດັບຕົ້ນ (初级)',
		nameCn: 'HSKK 初级',
		targetHsk: 'HSK 1 - 2 (ປະມານ 200–300 ຄຳ)',
		totalTimeMin: 17,
		passingScore: 60,
		descriptionLao:
			'ເໝາະສຳລັບຜູ້ເລີ່ມຕົ້ນຮຽນພາສາຈີນ. ທົດສອບຄວາມສາມາດໃນການຟັງ, ເວົ້າຕາມ, ຕອບຄຳຖາມສັ້ນ ແລະ ແນະນຳຕົນເອງ.',
		parts: [
			{
				partNumber: 1,
				titleCn: '第一部分：听后重复 (15题)',
				titleLao: 'ພາກທີ 1: ຟັງແລ້ວເວົ້າຕາມ (15 ຂໍ້)',
				countInfo: '15 ປະໂຫຍກ',
				timeInfo: 'ປະໂຫຍກລະ 10 ວິນາທີ'
			},
			{
				partNumber: 2,
				titleCn: '第二部分：听后回答 (10题)',
				titleLao: 'ພາກທີ 2: ຟັງແລ້ວຕອບຄຳຖາມ (10 ຂໍ້)',
				countInfo: '10 ຄຳຖາມ',
				timeInfo: 'ຂໍ້ລະ 10 ວິນາທີ'
			},
			{
				partNumber: 3,
				titleCn: '第三部分：回答问题 (2题)',
				titleLao: 'ພາກທີ 3: ຕອບຄຳຖາມປາກເປົ່າ (2 ຂໍ້)',
				countInfo: '2 ຂໍ້ໃຫຍ່',
				timeInfo: 'ກຽມ 7 ນາທີ, ຕອບຂໍ້ລະ 1.5 ນາທີ'
			}
		],
		questions: [
			// Part 1: 听后重复
			{
				id: 'p-1-1',
				partNumber: 1,
				partTitleCn: '第一部分：听后重复',
				partTitleLao: 'ພາກທີ 1: ຟັງແລ້ວເວົ້າຕາມ',
				instructionLao: 'ຟັງປະໂຫຍກພາສາຈີນ 1 ຮອບ ແລ້ວເວົ້າຕາມທັນທີ (ຈັບເວລາ 10 ວິນາທີ)',
				promptCn: '今天天气非常好。',
				promptPinyin: 'Jīntiān tiānqì fēicháng hǎo.',
				promptLao: 'ມື້ນີ້ອາກາດດີຫຼາຍ.',
				audioPrompt: '今天天气非常好。',
				prepTimeSec: 0,
				answerTimeSec: 10,
				modelAnswerCn: '今天天气非常好。',
				modelAnswerPinyin: 'Jīntiān tiānqì fēicháng hǎo.',
				modelAnswerLao: 'ມື້ນີ້ອາກາດດີຫຼາຍ.',
				tipsLao: 'ອອກສຽງໃຫ້ຊັດເຈນ, ໂທນສຽງ fēicháng (ສຽງ 1 ແລະ 2) ໃຫ້ຖືກຕ້ອງ.'
			},
			{
				id: 'p-1-2',
				partNumber: 1,
				partTitleCn: '第一部分：听后重复',
				partTitleLao: 'ພາກທີ 1: ຟັງແລ້ວເວົ້າຕາມ',
				instructionLao: 'ຟັງປະໂຫຍກພາສາຈີນ 1 ຮອບ ແລ້ວເວົ້າຕາມທັນທີ',
				promptCn: '我想去中国留学。',
				promptPinyin: 'Wǒ xiǎng qù Zhōngguó liúxué.',
				promptLao: 'ຂ້ອຍຢາກໄປຮຽນຕໍ່ຢູ່ປະເທດຈີນ.',
				audioPrompt: '我想去中国留学。',
				prepTimeSec: 0,
				answerTimeSec: 10,
				modelAnswerCn: '我想去中国留学。',
				modelAnswerPinyin: 'Wǒ xiǎng qù Zhōngguó liúxué.',
				modelAnswerLao: 'ຂ້ອຍຢາກໄປຮຽນຕໍ່ຢູ່ປະເທດຈີນ.',
				tipsLao: 'ຄຳວ່າ liúxué ໃຫ້ອອກສຽງສຽງ 2 ທັງສອງພະຍາງ.'
			},
			{
				id: 'p-1-3',
				partNumber: 1,
				partTitleCn: '第一部分：听后重复',
				partTitleLao: 'ພາກທີ 1: ຟັງແລ້ວເວົ້າຕາມ',
				instructionLao: 'ຟັງປະໂຫຍກພາສາຈີນ 1 ຮອບ ແລ້ວເວົ້າຕາມທັນທີ',
				promptCn: '这些苹果一斤多少钱？',
				promptPinyin: 'Zhèxiē píngguǒ yì jīn duōshao qián?',
				promptLao: 'ໝາກໂປ່ມເຫຼົ່ານີ້ເຄິ່ງກິໂລລາຄາເທົ່າໃດ?',
				audioPrompt: '这些苹果一斤多少钱？',
				prepTimeSec: 0,
				answerTimeSec: 10,
				modelAnswerCn: '这些苹果一斤多少钱？',
				modelAnswerPinyin: 'Zhèxiē píngguǒ yì jīn duōshao qián?',
				modelAnswerLao: 'ໝາກໂປ່ມເຫຼົ່ານີ້ເຄິ່ງກິໂລລາຄາເທົ່າໃດ?',
				tipsLao: 'ຮັກສາຈັງຫວະຄຳຖາມໃຫ້ເປັນທຳມະຊາດ.'
			},

			// Part 2: 听后回答
			{
				id: 'p-2-1',
				partNumber: 2,
				partTitleCn: '第二部分：听后回答',
				partTitleLao: 'ພາກທີ 2: ຟັງແລ້ວຕອບຄຳຖາມ',
				instructionLao: 'ຟັງຄຳຖາມແລ້ວຕອບເປັນປະໂຫຍກສັ້ນໃຫ້ກົງປະເດັນ (ຈັບເວລາ 10 ວິນາທີ)',
				promptCn: '你每天几点起床？',
				promptPinyin: 'Nǐ měitiān jǐ diǎn qǐchuáng?',
				promptLao: 'ເຈົ້າຕື່ນນອນຈັກໂມງໃນແຕ່ລະມື້?',
				audioPrompt: '你每天几点起床？',
				prepTimeSec: 0,
				answerTimeSec: 10,
				modelAnswerCn: '我每天早上七点起床。',
				modelAnswerPinyin: 'Wǒ měitiān zǎoshang qī diǎn qǐchuáng.',
				modelAnswerLao: 'ຂ້ອຍຕື່ນນອນຕອນເຊົ້າ 7 ໂມງທຸກໆມື້.',
				tipsLao: 'ຕອບເປັນປະໂຫຍກສົມບູນ ໂດຍປ່ຽນ 你 ເປັນ 我 ແລ້ວໃສ່ເວລາເຂົ້າໄປ.'
			},
			{
				id: 'p-2-2',
				partNumber: 2,
				partTitleCn: '第二部分：听后回答',
				partTitleLao: 'ພາກທີ 2: ຟັງແລ້ວຕອບຄຳຖາມ',
				instructionLao: 'ຟັງຄຳຖາມແລ້ວຕອບເປັນປະໂຫຍກສັ້ນໃຫ້ກົງປະເດັນ',
				promptCn: '你喜欢喝茶还是喝咖啡？',
				promptPinyin: 'Nǐ xǐhuan hē chá háishì hē kāfēi?',
				promptLao: 'ເຈົ້າມັກດື່ມຊາ ຫຼື ດື່ມກາເຟ?',
				audioPrompt: '你喜欢喝茶还是喝咖啡？',
				prepTimeSec: 0,
				answerTimeSec: 10,
				modelAnswerCn: '我更喜欢喝咖啡，因为很好喝。',
				modelAnswerPinyin: 'Wǒ gèng xǐhuan hē kāfēi, yīnwèi hěn hǎohē.',
				modelAnswerLao: 'ຂ້ອຍມັກດື່ມກາເຟຫຼາຍກວ່າ, ເພາະວ່າມັນແຊບຫຼາຍ.',
				tipsLao: 'ເລືອກຕອບຢ່າງໃດຢ່າງໜຶ່ງ ແລະ ສາມາດເພີ່ມເຫດຜົນສັ້ນໆ ເພື່ອໃຫ້ໄດ້ຄະແນນດີ.'
			},

			// Part 3: 回答问题
			{
				id: 'p-3-1',
				partNumber: 3,
				partTitleCn: '第三部分：回答问题',
				partTitleLao: 'ພາກທີ 3: ຕອບຄຳຖາມປາກເປົ່າ',
				instructionLao: 'ຕອບຄຳຖາມຕໍ່ໄປນີ້ຢ່າງລະອຽດ (ກຽມຕົວ 30 ວິນາທີ, ຕອບ 1 ນາທີ 30 ວິນາທີ)',
				promptCn: '请介绍一下你的家庭。（你家有几口人？他们是谁？他们做什么工作？）',
				promptPinyin:
					'Qǐng jièshào yíxià nǐ de jiātíng. (Nǐ jiā yǒu jǐ kǒu rén? Tāmen shì shéi? Tāmen zuò shénme gōngzuò?)',
				promptLao: 'ກະລຸນາແນະນຳກ່ຽວກັບຄອບຄົວຂອງເຈົ້າ. (ມີຈັກຄົນ? ມີໃຜແດ່? ເຂົາເຈົ້າເຮັດວຽກຫຍັງ?)',
				audioPrompt: '请介绍一下你的家庭。你家有几口人？他们是谁？他们做什么工作？',
				prepTimeSec: 30,
				answerTimeSec: 90,
				modelAnswerCn:
					'我家有四口人，爸爸、妈妈、姐姐和我。我爸爸是医生，他在医院工作；我妈妈是老师，她在中学教书。我姐姐在银行工作。我是老挝人，现在在努力学习汉语。我们一家人生活得很幸福。',
				modelAnswerPinyin:
					'Wǒ jiā yǒu sì kǒu rén, bàba, māma, jiějie hé wǒ. Wǒ bàba shì yīshēng, tā zài yīyuàn gōngzuò; wǒ māma shì lǎoshī, tā zài zhōngxué jiāoshū. Wǒ jiějie zài yínháng gōngzuò. Wǒ shì Lǎowō rén, xiànzài zài nǔlì xuéxí Hànyǔ. Wǒmen yì jiā rén shēnghuó de hěn xìngfú.',
				modelAnswerLao:
					'ຄອບຄົວຂ້ອຍມີ 4 ຄົນ: ພໍ່, ແມ່, ເອື້ອຍ ແລະ ຂ້ອຍ. ພໍ່ເປັນທ່ານໝໍ, ເຮັດວຽກຢູ່ໂຮງໝໍ; ແມ່ເປັນຄູ, ສອນຢູ່ໂຮງຮຽນມັດທະຍົມ. ເອື້ອຍເຮັດວຽກຢູ່ທະນາຄານ. ຂ້ອຍເປັນຄົນລາວ, ຕອນນີ້ກຳລັງຕັ້ງໃຈຮຽນພາສາຈີນ. ຄອບຄົວພວກເຮົາອາໄສຢູ່ດ້ວຍຄວາມອົບອຸ່ນແລະມີຄວາມສຸກ.',
				tipsLao: 'ເວົ້າໃຫ້ຄົບ 3 ປະເດັນ: ຈຳນວນສະມາຊິກ, ແມ່ນໃຜແດ່, ແລະ ອາຊີບ/ວຽກເຮັດງານທຳ.'
			},
			{
				id: 'p-3-2',
				partNumber: 3,
				partTitleCn: '第三部分：回答问题',
				partTitleLao: 'ພາກທີ 3: ຕອບຄຳຖາມປາກເປົ່າ',
				instructionLao: 'ຕອບຄຳຖາມຕໍ່ໄປນີ້ຢ່າງລະອຽດ (ກຽມຕົວ 30 ວິນາທີ, ຕອບ 1 ນາທີ 30 ວິນາທີ)',
				promptCn: '周末你常常做些什么？（你喜欢一个人还是和朋友在一起？）',
				promptPinyin:
					'Zhōumò nǐ chángcháng zuò xiē shénme? (Nǐ xǐhuan yí ge rén háishì hé péngyǒu zài yìqǐ?)',
				promptLao: 'ທ້າຍອາທິດ (ວັນເສົາ-ອາທິດ) ເຈົ້າມັກເຮັດຫຍັງແດ່? (ມັກຢູ່ຄົນດຽວ ຫຼື ຢູ່ກັບໝູ່?)',
				audioPrompt: '周末你常常做些什么？你喜欢一个人还是和朋友在一起？',
				prepTimeSec: 30,
				answerTimeSec: 90,
				modelAnswerCn:
					'周末我常常起得比较晚。吃完早饭后，我喜欢去公园跑步或者在家里看书。有时候，我也喜欢和朋友们一起出去喝咖啡、逛街聊天。我觉得和朋友在一起很开心，可以放松心情。',
				modelAnswerPinyin:
					'Zhōumò wǒ chángcháng qǐ de bǐjiào wǎn. Chī wán zǎofàn hòu, wǒ xǐhuan qù gōngyuán pǎobù huòzhě zài jiālǐ kànshū. Yǒushíhou, wǒ yě xǐhuan hé péngyǒumen yìqǐ chūqù hē kāfēi, guàngjiē liáotiān. Wǒ juéde hé péngyǒu zài yìqǐ hěn kāixīn, kěyǐ fàngsōng xīnqíng.',
				modelAnswerLao:
					'ທ້າຍອາທິດຂ້ອຍມັກຕື່ນສວາຍແດ່. ຫຼັງກິນເຂົ້າເຊົ້າແລ້ວ, ຂ້ອຍມັກໄປແລ່ນຢູ່ສວນສາທາລະນະ ຫຼື ອ່ານປຶ້ມຢູ່ເຮືອນ. ບາງຄັ້ງ, ຂ້ອຍກໍມັກອອກໄປດື່ມກາເຟ ແລະ ຍ່າງຫຼິ້ນກັບໝູ່. ຂ້ອຍຮູ້ສຶກວ່າຢູ່ກັບໝູ່ມີຄວາມສຸກ ແລະ ຜ່ອນຄາຍດີ.',
				tipsLao:
					'ໃຊ້ຄຳເຊື່ອມເຊັ່ນ: 吃完...后 (ຫຼັງຈາກ...), 有时候 (ບາງຄັ້ງ), 觉得 (ຮູ້ສຶກວ່າ) ເພື່ອໃຫ້ປະໂຫຍກຕໍ່ເນື່ອງ.'
			}
		]
	},

	intermediate: {
		id: 'intermediate',
		nameLao: 'HSKK ລະດັບກາງ (中级)',
		nameCn: 'HSKK 中级',
		targetHsk: 'HSK 3 - 4 (ປະມານ 900 ຄຳ)',
		totalTimeMin: 23,
		passingScore: 60,
		descriptionLao:
			'ທົດສອບຄວາມສາມາດໃນການຟັງແລ້ວເວົ້າຕາມ, ການເບິ່ງຮູບແລ້ວບັນຍາຍ ແລະ ການສະແດງຄວາມຄິດເຫັນ.',
		parts: [
			{
				partNumber: 1,
				titleCn: '第一部分：听后重复 (10题)',
				titleLao: 'ພາກທີ 1: ຟັງແລ້ວເວົ້າຕາມ (10 ຂໍ້)',
				countInfo: '10 ປະໂຫຍກຍາວ',
				timeInfo: 'ປະໂຫຍກລະ 10 ວິນາທີ'
			},
			{
				partNumber: 2,
				titleCn: '第二部分：看图说话 (2题)',
				titleLao: 'ພາກທີ 2: ເບິ່ງຮູບແລ້ວບັນຍາຍ (2 ຂໍ້)',
				countInfo: '2 ຮູບພາບ',
				timeInfo: 'ກຽມ 10 ນາທີ, ຕອບຂໍ້ລະ 2 ນາທີ'
			},
			{
				partNumber: 3,
				titleCn: '第三部分：回答问题 (2题)',
				titleLao: 'ພາກທີ 3: ຕອບຄຳຖາມ (2 ຂໍ້)',
				countInfo: '2 ຂໍ້ໃຫຍ່',
				timeInfo: 'ຕອບຂໍ້ລະ 2 ນາທີ'
			}
		],
		questions: [
			{
				id: 'm-1-1',
				partNumber: 1,
				partTitleCn: '第一部分：听后重复',
				partTitleLao: 'ພາກທີ 1: ຟັງແລ້ວເວົ້າຕາມ',
				instructionLao: 'ຟັງປະໂຫຍກຍາວ 1 ຮອບ ແລ້ວເວົ້າຕາມໃຫ້ຄົບຖ້ວນ (10 ວິນາທີ)',
				promptCn: '坚持每天运动不仅能减肥，还能保持身体健康。',
				promptPinyin:
					'Jiānchí měitiān yùndòng bùjǐn néng jiǎnféi, hái néng bǎochí shēntǐ jiànkāng.',
				promptLao:
					'ການຕັ້ງໃຈອອກກຳລັງກາຍທຸກມື້ ບໍ່ພຽງແຕ່ຊ່ວຍຫຼຸດນ້ຳໜັກ ແຕ່ຍັງຮັກສາສຸຂະພາບໃຫ້ແຂງແຮງ.',
				audioPrompt: '坚持每天运动不仅能减肥，还能保持身体健康。',
				prepTimeSec: 0,
				answerTimeSec: 10,
				modelAnswerCn: '坚持每天运动不仅能减肥，还能保持身体健康。',
				modelAnswerPinyin:
					'Jiānchí měitiān yùndòng bùjǐn néng jiǎnféi, hái néng bǎochí shēntǐ jiànkāng.',
				modelAnswerLao:
					'ການຕັ້ງໃຈອອກກຳລັງກາຍທຸກມື້ ບໍ່ພຽງແຕ່ຊ່ວຍຫຼຸດນ້ຳໜັກ ແຕ່ຍັງຮັກສາສຸຂະພາບໃຫ້ແຂງແຮງ.',
				tipsLao: 'ສັງເກດໂຄງສ້າງ 不仅……还…… (ບໍ່ພຽງແຕ່... ແຕ່ຍັງ...)'
			},
			{
				id: 'm-2-1',
				partNumber: 2,
				partTitleCn: '第二部分：看图说话',
				partTitleLao: 'ພາກທີ 2: ເບິ່ງຮູບແລ້ວບັນຍາຍ',
				instructionLao:
					'ເບິ່ງສະຖານະການໃນຮູບ ແລ້ວບັນຍາຍເລື່ອງລາວໃຫ້ເປັນເລື່ອງເປັນລາວ (ເວົ້າ 2 ນາທີ)',
				promptCn: '【场景】：超市里，一位年轻母亲带着小男孩正在推着购物车买新鲜蔬菜和水果。',
				promptPinyin:
					'【Chǎngjǐng】: Chāoshì lǐ, yí wèi niánqīng mǔqīn dài zhe xiǎo nánhái zhèngzài tuī zhe gòuwùchē mǎi xīnxiān shūcài hé shuǐguǒ.',
				promptLao:
					'【ສະຖານະການ】: ຢູ່ໃນຊຸບເປີມາເກັດ, ແມ່ໄວໜຸ່ມພ້ອມລູກຊາຍນ້ອຍກຳລັງຍູ້ລົດເຂັນຊື້ຜັກ ແລະ ໝາກໄມ້ສົດ.',
				audioPrompt: '请看图说话。画面中是一位母亲带着孩子在超市买东西。',
				prepTimeSec: 30,
				answerTimeSec: 120,
				modelAnswerCn:
					'从图中可以看出，这是一个周末的下午，一位母亲带着她大约五六岁的儿子正在超市买东西。超市里货架上摆满了各种各样新鲜的水果和蔬菜，比如红苹果、香蕉和西红柿。母亲一边选苹果，一边笑着问儿子想吃什么。小男孩双手扶着购物车，非常乖巧。我认为这展现了温馨幸福的家庭日常生活，也体现了健康生活方式。',
				modelAnswerPinyin:
					'Cóng tú zhōng kěyǐ kàn chū, zhè shì yí ge zhōumò de xiàwǔ, yí wèi mǔqīn dài zhe tā dàyuē wǔ liù suì de érzi zhèngzài chāoshì mǎi dōngxi. Chāoshì lǐ huòjià shàng bǎimǎn le gèzhǒng-gèyàng xīnxiān de shuǐguǒ hé shūcài, bǐrú hóng píngguǒ, xiāngjiāo hé xīhóngshì. Mǔqīn yìbiān xuǎn píngguǒ, yìbiān xiào zhe wèn érzi xiǎng chī shénme. Xiǎo nánhái shuāngshǒu fú zhe gòuwùchē, fēicháng guāiqiǎo. Wǒ rènwéi zhè zhǎnxiàn le wēnxīn xìngfú de jiātíng rìcháng shēnghuó, yě tǐxiàn le jiànkāng shēnghuó fāngshì.',
				modelAnswerLao:
					'ຈາກຮູບເຫັນໄດ້ວ່າ, ນີ້ແມ່ນຕອນບ່າຍວັນທ້າຍອາທິດ, ແມ່ພ້ອມລູກຊາຍອາຍຸປະມານ 5-6 ປີ ກຳລັງຊື້ເຄື່ອງໃນຊຸບເປີມາເກັດ. ເທິງຊັ້ນວາງມີໝາກໄມ້ແລະຜັກສົດຫຼາກຫຼາຍຊະນິດ ເຊັ່ນ ໝາກໂປ່ມແດງ, ໝາກກ້ວຍ, ໝາກເລັ່ນ. ແມ່ເລືອກໝາກໄມ້ພ້ອມຖາມລູກຊາຍ, ລູກຊາຍກໍຈັບລົດເຂັນຢ່າງໜ້າຮັກ. ຂ້ອຍຄິດວ່ານີ້ສະແດງເຖິງຄວາມອົບອຸ່ນຂອງຄອບຄົວ ແລະ ວິຖີຊີວິດທີ່ມີສຸຂະພາບດີ.',
				tipsLao:
					'ໂຄງສ້າງການຕອບ: 1. ເວລາ/ສະຖານທີ່/ໃຜ (从图中可以看出...) 2. ກຳລັງເຮັດຫຍັງ (正在...) 3. ລາຍລະອຽດອ້ອມຂ້າງ 4. ຄວາມຄິດເຫັນ/ສະຫຼຸບ (我认为...).'
			},
			{
				id: 'm-3-1',
				partNumber: 3,
				partTitleCn: '第三部分：回答问题',
				partTitleLao: 'ພາກທີ 3: ຕອບຄຳຖາມສະແດງຄວາມຄິດເຫັນ',
				instructionLao: 'ຕອບຄຳຖາມຕໍ່ໄປນີ້ໂດຍສະແດງເຫດຜົນ ແລະ ຕົວຢ່າງ (ເວົ້າ 2 ນາທີ)',
				promptCn: '有人说“金钱能买来一切，包括快乐”，你同意这种观点吗？为什么？',
				promptPinyin:
					'Yǒu rén shuō “jīnqián néng mǎilái yíqiè, bāokuò kuàilè”, nǐ tóngyì zhè zhǒng guāndiǎn ma? Wèishénme?',
				promptLao:
					'ມີຄົນເວົ້າວ່າ “ເງິນຄຳສາມາດຊື້ໄດ້ທຸກຢ່າງ ລວມທັງຄວາມສຸກ”, ເຈົ້າເຫັນດີນຳຄວາມຄິດນີ້ບໍ່? ຍ້ອນຫຍັງ?',
				audioPrompt: '有人说金钱能买来一切，包括快乐，你同意这种观点吗？为什么？',
				prepTimeSec: 30,
				answerTimeSec: 120,
				modelAnswerCn:
					'我不同意这个观点。虽然金钱在生活中非常重要，它可以满足我们基本的物质需求，比如买食物、衣服和房子，也能让我们生活得更舒适。但是，金钱并不是万能的。生活中最宝贵的东西，比如真正的友谊、家人的亲情、健康的身体和内心的平静，都是用金钱买不到的。有钱人如果不健康或者缺少爱，也不会真正快乐。所以，快乐来自于知足和爱，而不是金钱。',
				modelAnswerPinyin:
					'Wǒ bù tóngyì zhè ge guāndiǎn. Suīrán jīnqián zài shēnghuó zhōng fēicháng zhòngyào, tā kěyǐ mǎnzú wǒmen jīběn de wùzhì xūqiú, bǐrú mǎi shíwù, yīfu hé fángzi, yě néng ràng wǒmen shēnghuó de gèng shūshì. Dànshì, jīnqián bìng bù shì wànnéng de. Shēnghuó zhōng zuì bǎoguì de dōngxi, bǐrú zhēnzhèng de yǒuyì, jiārén de qīnqíng, jiànkāng de shēntǐ hé nèixīn de píngjìng, dōu shì yòng jīnqián mǎi búdào de. Yǒuqián rén rúguǒ bù jiànkāng huòzhě quēshǎo ài, yě bú huì zhēnzhèng kuàilè. Suǒyǐ, kuàilè láizì yú zhīzú hé ài, ér bú shì jīnqián.',
				modelAnswerLao:
					'ຂ້ອຍບໍ່ເຫັນດີນຳຄວາມຄິດນີ້. ເຖິງແມ່ນວ່າເງິນຈະມີຄວາມສຳຄັນຕໍ່ການດຳລົງຊີວິດ, ຊ່ວຍຕອບສະໜອງຄວາມຕ້ອງການພື້ນຖານ ເຊັ່ນ ອາຫານ, ເສື້ອຜ້າ ແລະ ທີ່ຢູ່ອາໄສ. ແຕ່ເງິນບໍ່ແມ່ນທຸກສິ່ງທຸກຢ່າງ. ສິ່ງທີ່ມີຄ່າທີ່ສຸດໃນຊີວິດ ເຊັ່ນ ມິດຕະພາບທີ່ແທ້ຈິງ, ຄວາມຮັກໃນຄອບຄົວ, ສຸຂະພາບທີ່ແຂງແຮງ ແລະ ຄວາມສະຫງົບໃນຈິດໃຈ ລ້ວນແຕ່ໃຊ້ເງິນຊື້ບໍ່ໄດ້. ຄວາມສຸກທີ່ແທ້ຈິງເກີດຈາກຄວາມພໍໃຈ ແລະ ຄວາມຮັກ, ບໍ່ແມ່ນເງິນຄຳ.',
				tipsLao:
					'ໃຊ້ຮູບແບບໂຕ້ແຍ້ງ: 1. ບອກຈຸດຢືນ (我不同意...) 2. ຍອມຮັບຂໍ້ດີບາງສ່ວນ (虽然金钱重要...) 3. ຍົກຂໍ້ຈຳກັດ (但是不是万能...) 4. ຍົກຕົວຢ່າງ (真诚的友谊、健康) 5. ສະຫຼຸບ (所以...).'
			}
		]
	},

	advanced: {
		id: 'advanced',
		nameLao: 'HSKK ລະດັບສູງ (高级)',
		nameCn: 'HSKK 高级',
		targetHsk: 'HSK 5 - 6 (ຫຼາຍກວ່າ 3,000 ຄຳ)',
		totalTimeMin: 25,
		passingScore: 60,
		descriptionLao:
			'ທົດສອບການຟັງບົດຄວາມຍາວແລ້ວເລົ່າຄືນ, ການອ່ານອອກສຽງບົດຄວາມ ແລະ ການຕອບຄຳຖາມວິເຄາະລະດັບສູງ.',
		parts: [
			{
				partNumber: 1,
				titleCn: '第一部分：听后复述 (3题)',
				titleLao: 'ພາກທີ 1: ຟັງແລ້ວເລົ່າຄືນ (3 ຂໍ້)',
				countInfo: '3 ບົດຄວາມສັ້ນ',
				timeInfo: 'ຟັງ 1 ນາທີ, ເລົ່າຄືນຂໍ້ລະ 2 ນາທີ'
			},
			{
				partNumber: 2,
				titleCn: '第二部分：朗读 (1题)',
				titleLao: 'ພາກທີ 2: ອ່ານບົດຄວາມອອກສຽງ (1 ຂໍ້)',
				countInfo: '1 ບົດຄວາມ (ປະມານ 250 ຕົວອັກສອນ)',
				timeInfo: 'ກຽມ 10 ນາທີ, ອ່ານ 2 ນາທີ'
			},
			{
				partNumber: 3,
				titleCn: '第三部分：回答问题 (2题)',
				titleLao: 'ພາກທີ 3: ຕອບຄຳຖາມວິເຄາະ (2 ຂໍ້)',
				countInfo: '2 ຂໍ້ໃຫຍ່',
				timeInfo: 'ຕອບຂໍ້ລະ 2.5 ນາທີ'
			}
		],
		questions: [
			{
				id: 'a-2-1',
				partNumber: 2,
				partTitleCn: '第二部分：朗读',
				partTitleLao: 'ພາກທີ 2: ອ່ານບົດຄວາມອອກສຽງ',
				instructionLao:
					'ອ່ານບົດຄວາມຕໍ່ໄປນີ້ອອກສຽງໃຫ້ຖືກຕ້ອງ, ຊັດເຈນ, ລຽນໄຫຼ ແລະ ມີອາລົມຄວາມຮູ້ສຶກ (2 ນາທີ)',
				promptCn:
					'读书是一种享受，也是一种提升自我的方式。在书本的海洋里，我们可以跨越时间和空间的限制，与古今中外的智者进行心灵的对话。通过阅读，我们不仅能够开阔视野、增长知识，更能培养独立思考的能力。无论生活多么忙碌，每天抽出半小时静心读书，都能给忙碌的心灵带来宁静与力量。',
				promptPinyin:
					'Dúshū shì yì zhǒng xiǎngshòu, yě shì yì zhǒng tíshēng zìwǒ de fāngshì. Zài shūběn de hǎiyáng lǐ, wǒmen kěyǐ kuàyuè shíjiān hé kōngjiān de xiànzhì, yǔ gǔjīn zhōngwài de zhìzhě jìnxíng xīnlíng de duìhuà. Tōngguò yuèdú, wǒmen bùjǐn nénggòu kāikuò shìyě, zēngzhǎng zhīshi, gèng néng péiyǎng dúlì sīkǎo de nénglì. Wúlùn shēnghuó duōme mánglù, měitiān chōuchū bàn xiǎoshí jìngxīn dúshū, dōu néng gěi mánglù de xīnlíng dàilái níngjìng yǔ lìliang.',
				promptLao:
					'ການອ່ານປຶ້ມແມ່ນຄວາມສຸກຢ່າງໜຶ່ງ ແລະ ເປັນວິທີການພັດທະນາຕົນເອງ. ໃນມະຫາສະໝຸດແຫ່ງປຶ້ມ, ພວກເຮົາສາມາດຂ້າມຜ່ານຂໍ້ຈຳກັດຂອງເວລາແລະສະຖານທີ່, ສົນທະນາທາງຈິດວິນຍານກັບນັກປາດທັງອະດີດແລະປັດຈຸບັນ. ຜ່ານການອ່ານ, ພວກເຮົາບໍ່ພຽງແຕ່ເປີດກວ້າງວິໄສທັດ, ເພີ່ມພູນຄວາມຮູ້, ແຕ່ຍັງສ້າງຄວາມສາມາດໃນການຄິດຢ່າງອິດສະຫຼະ. ບໍ່ວ່າຊີວິດຈະຫຍຸ້ງພຽງໃດ, ການແບ່ງເວລາ 30 ນາທີຕໍ່ມື້ອ່ານປຶ້ມຢ່າງສະຫງົບ ຈະນຳເອົາພະລັງແລະຄວາມສະຫງົບມາສູ່ຈິດໃຈ.',
				audioPrompt:
					'读书是一种享受，也是一种提升自我的方式。在书本的海洋里，我们可以跨越时间和空间的限制，与古今中外的智者进行心灵的对话。通过阅读，我们不仅能够开阔视野、增长知识，更能培养独立思考的能力。无论生活多么忙碌，每天抽出半小时静心读书，都能给忙碌的心灵带来宁静与力量。',
				prepTimeSec: 20,
				answerTimeSec: 120,
				modelAnswerCn: '读书是一种享受，也是一种提升自我的方式……',
				modelAnswerPinyin: 'Dúshū shì yì zhǒng xiǎngshòu……',
				modelAnswerLao: 'ການອ່ານປຶ້ມແມ່ນຄວາມສຸກຢ່າງໜຶ່ງ……',
				tipsLao:
					'ອ່ານດ້ວຍຈັງຫວະທີ່ໝັ້ນຄົງ, ບໍ່ອ່ານໄວເກີນໄປ, ຢຸດພັກຫາຍໃຈຕາມວັກຕອນເຄື່ອງໝາຍຈຸດ ແລະ ຈ້ຳ.'
			},
			{
				id: 'a-3-1',
				partNumber: 3,
				partTitleCn: '第三部分：回答问题',
				partTitleLao: 'ພາກທີ 3: ຕອບຄຳຖາມວິເຄາະ',
				instructionLao:
					'ຕອບຄຳຖາມຕໍ່ໄປນີ້ຢ່າງມີຫຼັກການ, ມີເຫດຜົນ ແລະ ໂຄງສ້າງທີ່ຊັດເຈນ (2 ນາທີ 30 ວິນາທີ)',
				promptCn: '你如何看待人工智能（AI）对现代人类社会生活和工作的影响？',
				promptPinyin:
					'Nǐ rúhé kàndài réngōng zhìnéng (AI) duì xiàndài rénlèi shèhuì shēnghuó hé gōngzuò de yǐngxiǎng?',
				promptLao:
					'ເຈົ້າມີມຸມມອງແນວໃດຕໍ່ຜົນກະທົບຂອງປັນຍາປະດິດ (AI) ຕໍ່ການດຳລົງຊີວິດ ແລະ ການເຮັດວຽກຂອງມະນຸດໃນຍຸກປັດຈຸບັນ?',
				audioPrompt: '你如何看待人工智能对现代人类社会生活和工作的影响？',
				prepTimeSec: 30,
				answerTimeSec: 150,
				modelAnswerCn:
					'我认为人工智能是一把“双刃剑”。一方面，AI极大地提高了生产效率，在医疗诊断、语言翻译、自动驾驶等领域带来了前所未有的便利；但另一方面，AI的发展也带来了挑战，比如部分传统工作岗位可能被取代，以及数据隐私和安全问题。总的来说，我们既要拥抱科技创新，利用AI为人类福祉服务，又要建立健全的法律规范，确保技术向善。',
				modelAnswerPinyin:
					'Wǒ rènwéi réngōng zhìnéng shì yì bǎ “shuāngrènjiàn”. Yì fāngmiàn, AI jídà de tígāo le shēngchǎn xiàolǜ, zài yīliáo zhěnduàn, yǔyán fānyì, zìdòng jiǎngshǐ děng lǐngyù dài lái le qiánsuǒwèiyǒu de biànlì; dàn lìng yì fāngmiàn, AI de fāzhǎn yě dài lái le tiǎozhàn, bǐrú bùfen chuántǒng gōngzuò gǎngwèi kěnéng bèi qǔdài, yǐjí shùjù yǐnsī hé ānquán wèntí. Zǒng de lái shuō, wǒmen jì yào yōngbào kējì chuàngxīn, lìyòng AI wèi rénlèi fúzhǐ fúwù, yòu yào jiànlì jiànquán de fǎlǜ guīfàn, quèbǎo jìshù xiàng shàn.',
				modelAnswerLao:
					'ຂ້ອຍເຫັນວ່າປັນຍາປະດິດ (AI) ແມ່ນ “ດາບສອງຄົມ”. ດ້ານໜຶ່ງ, AI ຊ່ວຍເພີ່ມປະສິດທິພາບການຜະລິດຢ່າງມະຫາສານ, ອຳນວຍຄວາມສະດວກໃນການແພດ, ການແປພາສາ ແລະ ລົດຍົນຂັບເຄື່ອນອັດຕະໂນມັດ; ແຕ່ອີກດ້ານໜຶ່ງ, ກໍສ້າງສິ່ງທ້າທາຍ ເຊັ່ນ ການທົດແທນແຮງງານບາງອາຊີບ, ບັນຫາຄວາມເປັນສ່ວນຕົວຂອງຂໍ້ມູນ. ສະຫຼຸບແລ້ວ, ພວກເຮົາຕ້ອງພ້ອມຮັບນະວັດຕະກຳ ແລະ ພ້ອມດຽວກັນນັ້ນກໍຕ້ອງມີກົດໝາຍຄຸ້ມຄອງເພື່ອໃຫ້ເຕັກໂນໂລຊີສ້າງປະໂຫຍດສູງສຸດແກ່ມວນມະນຸດ.',
				tipsLao:
					'ໃຊ້ສຳນວນລະດັບສູງ ເຊັ່ນ 双刃剑 (ດາບສອງຄົມ), 一方面……另一方面…… (ດ້ານໜຶ່ງ... ອີກດ້ານໜຶ່ງ...), 前所未有 (ບໍ່ເຄີຍມີມາກ່ອນ), 总的来说 (ສະຫຼຸບລວມ).'
			}
		]
	}
};
