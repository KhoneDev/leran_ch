export interface StoryParagraph {
	cn: string;
	pinyin: string;
	lao: string;
}

export interface StoryQuestion {
	q: string;
	options: string[];
	answer: number; // 0-based index
	explanation: string;
}

export interface StoryItem {
	id: string;
	titleCn: string;
	titlePinyin: string;
	titleLao: string;
	level: number; // 1-4
	category: string;
	summaryLao: string;
	paragraphs: StoryParagraph[];
	vocab: { word: string; pinyin: string; lao: string }[];
	questions: StoryQuestion[];
}

export const STORIES: StoryItem[] = [
	{
		id: 'story-1',
		titleCn: '我的小狗“豆豆”',
		titlePinyin: 'Wǒ de xiǎogǒu “Dòudou”',
		titleLao: 'ໝາໜ້ອຍຂອງຂ້ອຍ “ໂຕ້ໂຕ້”',
		level: 1,
		category: 'ສັດລ້ຽງ',
		summaryLao: 'ເລື່ອງລາວໜ້າຮັກກ່ຽວກັບໝາໂຕນ້ອຍສີຂາວທີ່ມັກຫຼິ້ນ ແລະ ກິນແຊບ',
		paragraphs: [
			{
				cn: '我家有一只小狗，它的名字叫“豆豆”。',
				pinyin: 'Wǒ jiā yǒu yì zhī xiǎogǒu, tā de míngzi jiào “Dòudou”.',
				lao: 'ຄອບຄົວຂ້ອຍມີໝາໜ້ອຍໂຕໜຶ່ງ, ຊື່ຂອງມັນແມ່ນ “ໂຕ້ໂຕ້”.'
			},
			{
				cn: '豆豆今年两岁，它的身体很小，毛是白色的，眼睛大大的，非常可爱。',
				pinyin:
					'Dòudou jīnnián liǎng suì, tā de shēntǐ hěn xiǎo, máo shì báisè de, yǎnjing dàdà de, fēicháng kě’ài.',
				lao: 'ໂຕ້ໂຕ້ປີນີ້ອາຍຸ 2 ປີ, ໂຕຂອງມັນນ້ອຍໆ, ຂົນສີຂາວ, ຕາໃຫຍ່ໆ, ໜ້າຮັກຫຼາຍ.'
			},
			{
				cn: '每天我回到家，豆豆都会跑到门口看我，对我摇尾巴。',
				pinyin: 'Měitiān wǒ huídào jiā, Dòudou dōuhuì pǎodào ménkǒu kàn wǒ, duì wǒ yáo wěiba.',
				lao: 'ທຸກໆມື້ເວລາຂ້ອຍກັບຮອດເຮືອນ, ໂຕ້ໂຕ້ຈະແລ່ນມາຍັງປະຕູເພື່ອເບິ່ງຂ້ອຍ ແລະ ແກວ່ງຫາງໃສ່ຂ້ອຍ.'
			},
			{
				cn: '它最喜欢吃苹果和肉，也喜欢和我一起在公园里跑步。我和家人都很喜欢它。',
				pinyin:
					'Tā zuì xǐhuan chī píngguǒ hé ròu, yě xǐhuan hé wǒ yìqǐ zài gōngyuán lǐ pǎobù. Wǒ hé jiārén dōu hěn xǐhuan tā.',
				lao: 'ມັນມັກກິນໝາກໂປ່ມ ແລະ ຊີ້ນທີ່ສຸດ, ແລະ ຍັງມັກແລ່ນນຳຂ້ອຍຢູ່ໃນສວນສາທາລະນະ. ຂ້ອຍ ແລະ ຄອບຄົວຮັກມັນຫຼາຍ.'
			}
		],
		vocab: [
			{ word: '小狗', pinyin: 'xiǎogǒu', lao: 'ໝາໜ້ອຍ' },
			{ word: '可爱', pinyin: 'kě’ài', lao: 'ໜ້າຮັກ' },
			{ word: '尾巴', pinyin: 'wěiba', lao: 'ຫາງ' },
			{ word: '公园', pinyin: 'gōngyuán', lao: 'ສວນສາທາລະນະ' },
			{ word: '跑步', pinyin: 'pǎobù', lao: 'ແລ່ນອອກກຳລັງກາຍ' }
		],
		questions: [
			{
				q: 'ໝາໜ້ອຍຊື່ຫຍັງ?',
				options: ['ໂຕ້ໂຕ້ (豆豆)', 'ສຽວໄປ๋ (小白)', 'ຮວາຮວາ (花花)', 'ຕ້າຕ້າ (大大)'],
				answer: 0,
				explanation: 'ໃນບົດເລື່ອງລະບຸ: 它的名字叫“豆豆” (ຊື່ຂອງມັນແມ່ນ ໂຕ້ໂຕ້).'
			},
			{
				q: 'ໂຕ້ໂຕ້ ມັກກິນຫຍັງທີ່ສຸດ?',
				options: ['ປາ ແລະ ເຂົ້າໜົມ', 'ໝາກໂປ່ມ ແລະ ຊີ້ນ (苹果和肉)', 'ຜັກ ແລະ ໝາກກ້ວຍ', 'ເຂົ້າຈີ່'],
				answer: 1,
				explanation: 'ໃນບົດເລື່ອງລະບຸ: 它最喜欢吃苹果和肉 (ມັນມັກກິນໝາກໂປ່ມ ແລະ ຊີ້ນທີ່ສຸດ).'
			}
		]
	},
	{
		id: 'story-2',
		titleCn: '去北京旅游的经历',
		titlePinyin: 'Qù Běijīng lǚyóu de jīnglì',
		titleLao: 'ປະສົບການໄປທ່ຽວປັກກິ່ງ',
		level: 2,
		category: 'ການທ່ອງທ່ຽວ',
		summaryLao: 'ການເດີນທາງໄປທ່ຽວເມືອງຫຼວງປັກກິ່ງ, ຂຶ້ນກຳແພງເມືອງຈີນ ແລະ ກິນເປັດປັກກິ່ງ',
		paragraphs: [
			{
				cn: '去年秋天，我和我的朋友一起去了中国的首都——北京。',
				pinyin: 'Qùnián qiūtiān, wǒ hé wǒ de péngyǒu yìqǐ qù le Zhōngguó de shǒudū——Běijīng.',
				lao: 'ລະດູໃບໄມ້ປົ່ງປີກາຍ, ຂ້ອຍ ແລະ ໝູ່ໄດ້ໄປທ່ຽວເມືອງຫຼວງຂອງປະເທດຈີນ—ປັກກິ່ງ.'
			},
			{
				cn: '北京有很多有名的地方，比如故宫、颐和园和长城。',
				pinyin: 'Běijīng yǒu hěn duō yǒumíng de dìfang, bǐrú Gùgōng, Yíhéyuán hé Chángchéng.',
				lao: 'ປັກກິ່ງມີສະຖານທີ່ທີ່ມີຊື່ສຽງຫຼາຍແຫ່ງ ເຊັ່ນ: ພະລາຊະວັງກູ້ກົງ, ສວນອີເຫີຢວນ ແລະ ກຳແພງເມືອງຈີນ.'
			},
			{
				cn: '中国人常说：“不到长城非好汉。”当我们爬上长城时，看到了美丽的风景，心里非常激动。',
				pinyin:
					'Zhōngguó rén cháng shuō: “Bú dào Chángchéng fēi hǎohàn.” Dāng wǒmen pá shàng Chángchéng shí, kàndào le měilì de fēngjǐng, xīnlǐ fēicháng jīdòng.',
				lao: 'ຄົນຈີນມັກເວົ້າວ່າ: “ບໍ່ຮອດກຳແພງເມືອງຈີນ ບໍ່ແມ່ນຜູ້ກ້າຫານ.” ເມື່ອພວກເຮົາປີນຂຶ້ນຮອດເທິງກຳແພງເມືອງຈີນ, ເຫັນທິວທັດທີ່ສວຍງາມ, ຮູ້ສຶກຕື່ນເຕັ້ນຫຼາຍ.'
			},
			{
				cn: '晚上，我们还去吃了正宗的北京烤鸭。烤鸭皮很脆，肉很香，真的太好吃了！这是一次难忘的旅行。',
				pinyin:
					'Wǎnshang, wǒmen hái qù chī le zhèngzōng de Běijīng kǎoyā. Kǎoyā pí hěn cuì, ròu hěn xiāng, zhēnde tài hǎochī le! Zhè shì yí cì nánwàng de lǚxíng.',
				lao: 'ຕອນແລງ, ພວກເຮົາຍັງໄດ້ໄປກິນເປັດປັກກິ່ງແທ້ໆ. ໜັງເປັດກອບຫຼາຍ, ຊີ້ນຫອມແຊບ, ແຊບແທ້ໆ! ນີ້ແມ່ນການເດີນທາງທີ່ໜ້າຈົດຈຳທີ່ສຸດ.'
			}
		],
		vocab: [
			{ word: '首都', pinyin: 'shǒudū', lao: 'ເມືອງຫຼວງ' },
			{ word: '长城', pinyin: 'Chángchéng', lao: 'ກຳແພງເມືອງຈີນ' },
			{ word: '风景', pinyin: 'fēngjǐng', lao: 'ທິວທັດ / ວິວ' },
			{ word: '北京烤鸭', pinyin: 'Běijīng kǎoyā', lao: 'ເປັດປີ້ງປັກກິ່ງ' },
			{ word: '难忘', pinyin: 'nánwàng', lao: 'ຍາກທີ່ຈະລືມ / ໜ້າຈົດຈຳ' }
		],
		questions: [
			{
				q: 'ສຸພາສິດຈີນກ່າວເຖິງສະຖານທີ່ໃດ?',
				options: [
					'颐和园 (ສວນອີເຫີຢວນ)',
					'长城 (ກຳແພງເມືອງຈີນ)',
					'故宫 (ກູ້ກົງ)',
					'天安门 (ທຽນອັນເໝິນ)'
				],
				answer: 1,
				explanation: 'ສຸພາສິດ “不到长城非好汉” ໝາຍເຖິງກຳແພງເມືອງຈີນ.'
			},
			{
				q: 'ອາຫານແຊບທີ່ເຂົາເຈົ້າໄດ້ກິນໃນຕອນແລງແມ່ນຫຍັງ?',
				options: ['火锅 (ໝໍ້ໄຟ)', '北京烤鸭 (ເປັດປີ້ງປັກກິ່ງ)', '饺子 (ກຽວ)', '包子 (ຊາລາເປົາ)'],
				answer: 1,
				explanation: 'ໃນບົດເລື່ອງລະບຸວ່າ: 吃了正宗的北京烤鸭 (ກິນເປັດປີ້ງປັກກິ່ງ).'
			}
		]
	},
	{
		id: 'story-3',
		titleCn: '成语故事：井底之蛙',
		titlePinyin: 'Chéngyǔ gùshi: Jǐng dǐ zhī wā',
		titleLao: 'ນິທານສຸພາສິດ: ກົບໃນກະບອກນ້ຳ (ກົບໃນກະລາ)',
		level: 3,
		category: 'ນິທານສຸພາສິດ',
		summaryLao: 'ນິທານສຸພາສິດສອນໃຈກ່ຽວກັບກົບທີ່ຄິດວ່າໂລກມີຂະໜາດເທົ່າປາກນ້ຳສ້າງ',
		paragraphs: [
			{
				cn: '从前，有一只青蛙住在一口废弃的浅井里。它觉得自己过得非常快乐。',
				pinyin:
					'Cóngqián, yǒu yì zhī qīngwā zhù zài yì kǒu fèiqì de qiǎnjǐng lǐ. Tā juéde zìjǐ guò de fēicháng kuàilè.',
				lao: 'ແຕ່ກີ້ແຕ່ກ່ອນ, ມີກົບໂຕໜຶ່ງອາໄສຢູ່ໃນນ້ຳສ້າງຕື້ນໆທີ່ຮ້າງ. ມັນຮູ້ສຶກວ່າຕົນເອງມີຄວາມສຸກຫຼາຍ.'
			},
			{
				cn: '它每天在井里跳来跳去，渴了就喝井水，困了就在泥里睡觉。它对周围的小动物说：“我是这口井的主人，这里是世界上最好的地方！”',
				pinyin:
					'Tā měitiān zài jǐng lǐ tiào lái tiào qù, kě le jiù hē jǐngshuǐ, kùn le jiù zài ní lǐ shuìjiào. Tā duì zhōuwéi de xiǎo dòngwù shuō: “Wǒ shì zhè kǒu jǐng de zhǔrén, zhèlǐ shì shìjiè shàng zuì hǎo de dìfang!”',
				lao: 'ທຸກໆມື້ມັນໂດດໄປມາໃນນ້ຳສ້າງ, ຫິວນ້ຳກໍດື່ມນ້ຳສ້າງ, ງ້ວງນອນກໍນອນໃນຕົມ. ມັນເວົ້າກັບສັດນ້ອຍອ້ອມຂ້າງວ່າ: “ຂ້ອຍເປັນເຈົ້າຂອງນ້ຳສ້າງນີ້, ບ່ອນນີ້ດີທີ່ສຸດໃນໂລກ!”'
			},
			{
				cn: '有一天，一只生活在大海里的大海龟来到了井边。青蛙得意地邀请海龟进来看。',
				pinyin:
					'Yǒu yì tiān, yì zhī shēnghuó zài dàhǎi lǐ de dà hǎiguī lái dào le jǐng biān. Qīngwā déyì de yāoqǐng hǎiguī jìn lái kàn.',
				lao: 'ມື້ໜຶ່ງ, ເຕົ່າທະເລໃຫຍ່ທີ່ອາໄສຢູ່ໃນມະຫາສະໝຸດໄດ້ຍ່າງມາຍັງຂອບນ້ຳສ້າງ. ກົບກໍໄດ້ເຊື້ອເຊີນເຕົ່າທະເລລົງມາເບິ່ງຢ່າງພາກພູມໃຈ.'
			},
			{
				cn: '海龟告诉青蛙：“大海辽阔无边，水深得无法计算。那才叫真正的壮观呢！”青蛙听了目瞪口呆，终于知道自己的眼光太狭窄了。',
				pinyin:
					'Hǎiguī gàosu qīngwā: “Dàhǎi liáokuò wúbiān, shuǐ shēn de wúfǎ jìsuàn. Nà cái jiào zhēnzhèng de zhuàngguān ne!” Qīngwā tīng le mùdèng-kǒudāi, zhōngyú zhīdào zìjǐ de yǎnguāng tài xiázhǎi le.',
				lao: 'ເຕົ່າທະເລບອກກົບວ່າ: “ທະເລກວ້າງໃຫຍ່ໄພສານບໍ່ມີຂອບເຂດ, ນ້ຳເລິກຈົນຄຳນວນບໍ່ໄດ້. ນັ້ນຈຶ່ງເອີ້ນວ່າຍິ່ງໃຫຍ່ແທ້ໆ!” ກົບໄດ້ຍິນແລ້ວຕົກຕະລຶງຕາຄ້າງ, ໃນທີ່ສຸດກໍຮູ້ວ່າສາຍຕາຄວາມຮູ້ຂອງຕົນເອງຄັບແຄບເກີນໄປ.'
			}
		],
		vocab: [
			{ word: '青蛙', pinyin: 'qīngwā', lao: 'ກົບ' },
			{ word: '大海', pinyin: 'dàhǎi', lao: 'ທະເລ / ມະຫາສະໝຸດ' },
			{ word: '辽阔', pinyin: 'liáokuò', lao: 'ກວ້າງໃຫຍ່ໄພສານ' },
			{ word: '目瞪口呆', pinyin: 'mùdèng-kǒudāi', lao: 'ຕົກຕະລຶງຕາຄ້າງ' },
			{ word: '狭窄', pinyin: 'xiázhǎi', lao: 'ຄັບແຄບ' }
		],
		questions: [
			{
				q: 'ສຸພາສິດ “井底之蛙” (ກົບໃນນ້ຳສ້າງ) ສອນເຮົາເລື່ອງຫຍັງ?',
				options: [
					'ການຮັກສານ້ຳສະອາດ',
					'ຄົນທີ່ມີຄວາມຮູ້ແລະມຸມມອງຄັບແຄບແຕ່ຄິດວ່າຕົນເອງຮູ້ໝົດທຸກຢ່າງ',
					'ການຝຶກໂດດໃຫ້ສູງ',
					'ການຮຽນລອຍນ້ຳໃນທະເລ'
				],
				answer: 1,
				explanation: 'ປຽບທຽບໃສ່ຄົນທີ່ມີໂລກກະທັດຄັບແຄບ ແຕ່ຫຼົງຄິດວ່າຕົນເອງເກັ່ງ ແລະ ຮູ້ທຸກຢ່າງແລ້ວ.'
			}
		]
	}
];
