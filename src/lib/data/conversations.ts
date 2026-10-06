export interface DialogueLine {
	speaker: string;
	speakerName: string;
	avatar: string;
	cn: string;
	pinyin: string;
	lao: string;
}

export interface ConversationItem {
	id: string;
	titleCn: string;
	titlePinyin: string;
	titleLao: string;
	level: number; // 1-4
	category: string;
	description: string;
	lines: DialogueLine[];
	vocab: { word: string; pinyin: string; lao: string }[];
}

export const CONVERSATIONS: ConversationItem[] = [
	{
		id: 'conv-1',
		titleCn: '问候与打招呼',
		titlePinyin: 'Wènhòu yǔ dǎ zhāohu',
		titleLao: 'ການທັກທາຍ ແລະ ຖາມສະບາຍດີ',
		level: 1,
		category: 'ພື້ນຖານ',
		description: 'ບົດສົນທະນາການທັກທາຍທົ່ວໄປລະຫວ່າງເພື່ອນທີ່ພົບກັນ',
		lines: [
			{
				speaker: 'A',
				speakerName: '王朋 (Wang Peng)',
				avatar: '👨',
				cn: '你好！你好吗？',
				pinyin: 'Nǐ hǎo! Nǐ hǎo ma?',
				lao: 'ສະບາຍດີ! ເຈົ້າສະບາຍດີບໍ່?'
			},
			{
				speaker: 'B',
				speakerName: '李友 (Li You)',
				avatar: '👩',
				cn: '我很好，你呢？',
				pinyin: 'Wǒ hěn hǎo, nǐ ne?',
				lao: 'ຂ້ອຍສະບາຍດີຫຼາຍ, ເຈົ້າເດ?'
			},
			{
				speaker: 'A',
				speakerName: '王朋 (Wang Peng)',
				avatar: '👨',
				cn: '我也很好。你最近忙吗？',
				pinyin: 'Wǒ yě hěn hǎo. Nǐ zuìjìn máng ma?',
				lao: 'ຂ້ອຍກໍສະບາຍດີຄືກັນ. ຊ່ວງນີ້ເຈົ້າຫຍຸ້ງວຽກບໍ່?'
			},
			{
				speaker: 'B',
				speakerName: '李友 (Li You)',
				avatar: '👩',
				cn: '不太忙。明天见！',
				pinyin: 'Bú tài máng. Míngtiān jiàn!',
				lao: 'ບໍ່ຄ່ອຍຫຍຸ້ງປານໃດ. ມື້ອື່ນພົບກັນເດີ້!'
			},
			{
				speaker: 'A',
				speakerName: '王朋 (Wang Peng)',
				avatar: '👨',
				cn: '好的，明天见！再见！',
				pinyin: 'Hǎo de, míngtiān jiàn! Zàijiàn!',
				lao: 'ໂດຍ, ມື້ອື່ນພົບກັນ! ລາກ່ອນ!'
			}
		],
		vocab: [
			{ word: '你好', pinyin: 'nǐ hǎo', lao: 'ສະບາຍດີ' },
			{ word: '最近', pinyin: 'zuìjìn', lao: 'ຊ່ວງນີ້ / ໄລຍະນີ້' },
			{ word: '忙', pinyin: 'máng', lao: 'ຫຍຸ້ງ (ວຽກ)' },
			{ word: '明天见', pinyin: 'míngtiān jiàn', lao: 'ມື້ອື່ນພົບກັນ' },
			{ word: '再见', pinyin: 'zàijiàn', lao: 'ລາກ່ອນ / ພົບກັນໃໝ່' }
		]
	},
	{
		id: 'conv-2',
		titleCn: '自我介绍与认识新朋友',
		titlePinyin: 'Zìwǒ jièshào yǔ rènshí xīn péngyǒu',
		titleLao: 'ການແນະນຳຕົວເອງ ແລະ ຮູ້ຈັກເພື່ອນໃໝ່',
		level: 1,
		category: 'ແນະນຳຕົວ',
		description: 'ການແນະນຳຊື່, ສັນຊາດ ແລະ ຄວາມຮູ້ສຶກທີ່ໄດ້ຮູ້ຈັກກັນ',
		lines: [
			{
				speaker: 'A',
				speakerName: '大卫 (David)',
				avatar: '👱‍♂️',
				cn: '请问，你叫什么名字？',
				pinyin: 'Qǐngwèn, nǐ jiào shénme míngzi?',
				lao: 'ຂໍຖາມແດ່, ເຈົ້າຊື່ຫຍັງ?'
			},
			{
				speaker: 'B',
				speakerName: '占达 (Chanda)',
				avatar: '👩‍🦰',
				cn: '我叫占达。你是哪国人？',
				pinyin: 'Wǒ jiào Zhāndá. Nǐ shì nǎ guó rén?',
				lao: 'ຂ້ອຍຊື່ ຈັນດາ. ເຈົ້າເປັນຄົນປະເທດໃດ?'
			},
			{
				speaker: 'A',
				speakerName: '大卫 (David)',
				avatar: '👱‍♂️',
				cn: '我是美国人，我在中国学习汉语。你呢？',
				pinyin: 'Wǒ shì Měiguó rén, wǒ zài Zhōngguó xuéxí Hànyǔ. Nǐ ne?',
				lao: 'ຂ້ອຍເປັນຄົນອາເມລິກາ, ຂ້ອຍຮຽນພາສາຈີນຢູ່ປະເທດຈີນ. ເຈົ້າເດ?'
			},
			{
				speaker: 'B',
				speakerName: '占达 (Chanda)',
				avatar: '👩‍🦰',
				cn: '我是老挝人，我也在学汉语。',
				pinyin: 'Wǒ shì Lǎowō rén, wǒ yě zài xué Hànyǔ.',
				lao: 'ຂ້ອຍເປັນຄົນລາວ, ຂ້ອຍກໍກຳລັງຮຽນພາສາຈີນຄືກັນ.'
			},
			{
				speaker: 'A',
				speakerName: '大卫 (David)',
				avatar: '👱‍♂️',
				cn: '认识你很高兴！',
				pinyin: 'Rènshí nǐ hěn gāoxìng!',
				lao: 'ຍິນດີທີ່ໄດ້ຮູ້ຈັກເຈົ້າ!'
			},
			{
				speaker: 'B',
				speakerName: '占达 (Chanda)',
				avatar: '👩‍🦰',
				cn: '认识你我也很高兴！',
				pinyin: 'Rènshí nǐ wǒ yě hěn gāoxìng!',
				lao: 'ຂ້ອຍກໍຍິນດີຫຼາຍທີ່ໄດ້ຮູ້ຈັກເຈົ້າຄືກັນ!'
			}
		],
		vocab: [
			{ word: '请问', pinyin: 'qǐngwèn', lao: 'ຂໍຖາມແດ່' },
			{ word: '老挝', pinyin: 'Lǎowō', lao: 'ປະເທດລາວ' },
			{ word: '汉语', pinyin: 'Hànyǔ', lao: 'ພາສາຈີນ' },
			{ word: '认识', pinyin: 'rènshi', lao: 'ຮູ້ຈັກ' },
			{ word: '高兴', pinyin: 'gāoxìng', lao: 'ດີໃຈ / ມີຄວາມສຸກ' }
		]
	},
	{
		id: 'conv-3',
		titleCn: '在饭馆点菜',
		titlePinyin: 'Zài fànguǎn diǎncài',
		titleLao: 'ການສັ່ງອາຫານໃນຮ້ານອາຫານ',
		level: 2,
		category: 'ອາຫານ & ເຄື່ອງດື່ມ',
		description: 'ບົດສົນທະນາລະຫວ່າງລູກຄ້າ ແລະ ບໍລິກອນໃນຮ້ານອາຫານຈີນ',
		lines: [
			{
				speaker: 'A',
				speakerName: '服务员 (ບໍລິກອນ)',
				avatar: '🧑‍🍳',
				cn: '欢迎光临！请问几位？',
				pinyin: 'Huānyíng guānglín! Qǐngwèn jǐ wèi?',
				lao: 'ຍິນດີຕ້ອນຮັບ! ຂໍຖາມແດ່ມາຈັກທ່ານ?'
			},
			{
				speaker: 'B',
				speakerName: '顾客 (ລູກຄ້າ)',
				avatar: '👨‍💼',
				cn: '两位。请给我们看一下菜单。',
				pinyin: 'Liǎng wèi. Qǐng gěi wǒmen kàn yíxià càidān.',
				lao: 'ສອງທ່ານ. ຂໍເມນູອາຫານໃຫ້ພວກເຮົາເບິ່ງແດ່.'
			},
			{
				speaker: 'A',
				speakerName: '服务员 (ບໍລິກອນ)',
				avatar: '🧑‍🍳',
				cn: '这是菜单。二位想吃点儿什么？',
				pinyin: 'Zhè shì càidān. Èr wèi xiǎng chī diǎnr shénme?',
				lao: 'ນີ້ແມ່ນເມນູອາຫານ. ທັງສອງທ່ານຢາກກິນຫຍັງແດ່?'
			},
			{
				speaker: 'B',
				speakerName: '顾客 (ລູກຄ້າ)',
				avatar: '👨‍💼',
				cn: '来一份宫保鸡丁，一碗牛肉面，不要太辣。',
				pinyin: 'Lái yí fèn gōngbǎojīdīng, yì wǎn niúròumiàn, bú yào tài là.',
				lao: 'ເອົາໄກ່ຜັດຖົ່ວດິນ (ກຸງປາວຈີຕິງ) 1 ຈານ, ໝີ່ຊີ້ນງົວ 1 ຖ້ວຍ, ບໍ່ເອົາເຜັດຫຼາຍເດີ້.'
			},
			{
				speaker: 'A',
				speakerName: '服务员 (ບໍລິກອນ)',
				avatar: '🧑‍🍳',
				cn: '好的。想喝什么饮料吗？',
				pinyin: 'Hǎo de. Xiǎng hē shénme yǐnliào ma?',
				lao: 'ໂດຍ. ຢາກດື່ມເຄື່ອງດື່ມຫຍັງບໍ່?'
			},
			{
				speaker: 'B',
				speakerName: '顾客 (ລູກຄ້າ)',
				avatar: '👨‍💼',
				cn: '来两杯冰水，谢谢！',
				pinyin: 'Lái liǎng bēi bīngshuǐ, xièxie!',
				lao: 'ເອົານ້ຳເຢັນ 2 ຈອກ, ຂອບໃຈ!'
			}
		],
		vocab: [
			{ word: '菜单', pinyin: 'càidān', lao: 'ເມນູອາຫານ' },
			{ word: '点菜', pinyin: 'diǎncài', lao: 'ສັ່ງອາຫານ' },
			{ word: '牛肉面', pinyin: 'niúròumiàn', lao: 'ໝີ່ຊີ້ນງົວ' },
			{ word: '辣', pinyin: 'là', lao: 'ເຜັດ' },
			{ word: '饮料', pinyin: 'yǐnliào', lao: 'ເຄື່ອງດື່ມ' }
		]
	},
	{
		id: 'conv-4',
		titleCn: '在商店买东西与讲价',
		titlePinyin: 'Zài shāngdiàn mǎi dōngxi yǔ jiǎngjià',
		titleLao: 'ການຊື້ເຄື່ອງ ແລະ ຕໍ່ລອງລາຄາ',
		level: 2,
		category: 'ຊື້ເຄື່ອງ',
		description: 'ການຊື້ເສື້ອຜ້າ ແລະ ຕໍ່ລອງລາຄາໃນຕະຫຼາດ ຫຼື ຮ້ານຄ້າ',
		lines: [
			{
				speaker: 'A',
				speakerName: '顾客 (ລູກຄ້າ)',
				avatar: '👩',
				cn: '你好，这件衣服多少钱？',
				pinyin: 'Nǐ hǎo, zhè jiàn yīfu duōshao qián?',
				lao: 'ສະບາຍດີ, ເສື້ອໂຕນີ້ລາຄາເທົ່າໃດ?'
			},
			{
				speaker: 'B',
				speakerName: '售货员 (ຄົນຂາຍ)',
				avatar: '🧑‍💼',
				cn: '这件衣服两百块。',
				pinyin: 'Zhè jiàn yīfu liǎng bǎi kuài.',
				lao: 'ເສື້ອໂຕນີ້ 200 ຢວນ.'
			},
			{
				speaker: 'A',
				speakerName: '顾客 (ລູກຄ້າ)',
				avatar: '👩',
				cn: '太贵了！能不能便宜一点儿？',
				pinyin: 'Tài guì le! Néng bu néng piányi yìdiǎnr?',
				lao: 'ແພງໂພດ! ຫຼຸດລາຄາລົງໜ້ອຍໜຶ່ງໄດ້ບໍ່?'
			},
			{
				speaker: 'B',
				speakerName: '售货员 (ຄົນຂາຍ)',
				avatar: '🧑‍💼',
				cn: '一百八十块，怎么样？',
				pinyin: 'Yì bǎi bāshí kuài, zěnmeyàng?',
				lao: '180 ຢວນ, ເປັນແນວໃດ?'
			},
			{
				speaker: 'A',
				speakerName: '顾客 (ລູກຄ້າ)',
				avatar: '👩',
				cn: '一百五十块，可以吗？可以的话我就买。',
				pinyin: 'Yì bǎi wǔshí kuài, kěyǐ ma? Kěyǐ de huà wǒ jiù mǎi.',
				lao: '150 ຢວນ, ໄດ້ບໍ່? ຖ້າໄດ້ຂ້ອຍຈະຊື້ເລີຍ.'
			},
			{
				speaker: 'B',
				speakerName: '售货员 (ຄົນຂາຍ)',
				avatar: '🧑‍💼',
				cn: '好吧，给你吧！你可以用微信或者支付宝付款。',
				pinyin: 'Hǎo ba, gěi nǐ ba! Nǐ kěyǐ yòng Wēixìn huòzhě Zhīfùbǎo fùkuǎn.',
				lao: 'ຕົກລົງ, ໃຫ້ເຈົ້າເລີຍ! ເຈົ້າສາມາດຈ່າຍເງິນຜ່ານ WeChat ຫຼື Alipay ໄດ້.'
			}
		],
		vocab: [
			{ word: '多少钱', pinyin: 'duōshao qián', lao: 'ເທົ່າໃດເງິນ / ລາຄາເທົ່າໃດ' },
			{ word: '便宜', pinyin: 'piányi', lao: 'ຖືກ / ລາຄາຖືກ' },
			{ word: '贵', pinyin: 'guì', lao: 'ແພງ' },
			{ word: '付款', pinyin: 'fùkuǎn', lao: 'ຊຳລະເງິນ' }
		]
	},
	{
		id: 'conv-5',
		titleCn: '问路与乘坐出租车',
		titlePinyin: 'Wènlù yǔ chéngzuò chūzūchē',
		titleLao: 'ການຖາມທາງ ແລະ ຂີ່ລົດແທັກຊີ',
		level: 3,
		category: 'ການເດີນທາງ',
		description: 'ການຖາມທາງໄປສະຖານີລົດໄຟ ແລະ ບອກຄົນຂັບລົດແທັກຊີ',
		lines: [
			{
				speaker: 'A',
				speakerName: '乘客 (ຜູ້ໂດຍສານ)',
				avatar: '👨‍🦱',
				cn: '师傅，请问去高铁站怎么走？大概需要多长时间？',
				pinyin: 'Shīfu, qǐngwèn qù gāotiě zhàn zěnme zǒu? Dàgài xūyào duō cháng shíjiān?',
				lao: 'ອາຈານຄົນຂັບ, ຂໍຖາມແດ່ໄປສະຖານີລົດໄຟຄວາມໄວສູງໄປແນວໃດ? ປະມານໃຊ້ເວລາດົນປານໃດ?'
			},
			{
				speaker: 'B',
				speakerName: '司机 (ຄົນຂັບ)',
				avatar: '🚖',
				cn: '现在不堵车，大概二十分钟就能到。请系好安全带。',
				pinyin: 'Xiànzài bù dǔchē, dàgài èrshí fēnzhōng jiù néng dào. Qǐng jì hǎo ānquándài.',
				lao: 'ຕອນນີ້ລົດບໍ່ຕິດ, ປະມານ 20 ນາທີກໍຮອດແລ້ວ. ກະລຸນາຮັດສາຍແອວນິລະໄພແດ່.'
			},
			{
				speaker: 'A',
				speakerName: '乘客 (ຜູ້ໂດຍສານ)',
				avatar: '👨‍🦱',
				cn: '好的。到了前面那个路口请右转。',
				pinyin: 'Hǎo de. Dào le qiánmiàn nà ge lùkǒu qǐng yòuzhuǎn.',
				lao: 'ໂດຍ. ຮອດທາງແຍກຂ້າງໜ້ານັ້ນກະລຸນາລ້ຽວຂວາເດີ້.'
			},
			{
				speaker: 'B',
				speakerName: '司机 (ຄົນຂັບ)',
				avatar: '🚖',
				cn: '没问题。高铁站到了，一共三十五元。请带好您的随身物品。',
				pinyin:
					'Méi wèntí. Gāotiě zhàn dào le, yígòng sānshíwǔ yuán. Qǐng dài hǎo nín de suíshēn wùpǐn.',
				lao: 'ບໍ່ມີບັນຫາ. ຮອດສະຖານີລົດໄຟຄວາມໄວສູງແລ້ວ, ທັງໝົດ 35 ຢວນ. ກະລຸນາກວດເບິ່ງເຄື່ອງຂອງຕິດໂຕໃຫ້ຄົບເດີ້.'
			}
		],
		vocab: [
			{ word: '高铁站', pinyin: 'gāotiě zhàn', lao: 'ສະຖານີລົດໄຟຄວາມໄວສູງ' },
			{ word: '堵车', pinyin: 'dǔchē', lao: 'ລົດຕິດ' },
			{ word: '安全带', pinyin: 'ānquándài', lao: 'ສາຍຮັດນິລະໄພ' },
			{ word: '右转', pinyin: 'yòuzhuǎn', lao: 'ລ້ຽວຂວາ' },
			{ word: '随身物品', pinyin: 'suíshēn wùpǐn', lao: 'ສິ່ງຂອງຕິດໂຕ' }
		]
	},
	{
		id: 'conv-6',
		titleCn: '生病看医生',
		titlePinyin: 'Shēngbìng kàn yīshēng',
		titleLao: 'ບໍ່ສະບາຍໄປຫາທ່ານໝໍ',
		level: 3,
		category: 'ສຸຂະພາບ',
		description: 'ບົດສົນທະນາບອກອາການເຈັບເປັນກັບທ່ານໝໍໃນໂຮງໝໍ',
		lines: [
			{
				speaker: 'A',
				speakerName: '医生 (ທ່ານໝໍ)',
				avatar: '👨‍⚕️',
				cn: '你怎么了？哪里不舒服？',
				pinyin: 'Nǐ zěnme le? Nǎlǐ bù shūfu?',
				lao: 'ເຈົ້າເປັນຫຍັງມາ? ບໍ່ສະບາຍບ່ອນໃດ?'
			},
			{
				speaker: 'B',
				speakerName: '病人 (ຄົນເຈັບ)',
				avatar: '🤒',
				cn: '医生，我从昨天晚上开始头疼、发烧，还咳嗽。',
				pinyin: 'Yīshēng, wǒ cóng zuótiān wǎnshang kāishǐ tóuténg, fāshāo, hái késou.',
				lao: 'ທ່ານໝໍ, ຂ້ອຍເຈັບຫົວ, ເປັນໄຂ້ ແລະ ໄອ ຕັ້ງແຕ່ຄືນວານນີ້.'
			},
			{
				speaker: 'A',
				speakerName: '医生 (ທ່ານໝໍ)',
				avatar: '👨‍⚕️',
				cn: '让我量一下体温……三十八度五。你感冒了。',
				pinyin: 'Ràng wǒ liáng yíxià tǐwēn…… Sānshíbā dù wǔ. Nǐ gǎnmào le.',
				lao: 'ຂໍວັດແທກອຸນຫະພູມເບິ່ງແດ່…… 38.5 ອົງສາ. ເຈົ້າເປັນຫວັດແລ້ວ.'
			},
			{
				speaker: 'B',
				speakerName: '病人 (ຄົນເຈັບ)',
				avatar: '🤒',
				cn: '严重吗？需要打针吗？',
				pinyin: 'Yánzhòng ma? Xūyào dǎzhēn ma?',
				lao: 'ຮ້າຍແຮງບໍ່? ຈຳເປັນຕ້ອງສັກຢາບໍ່?'
			},
			{
				speaker: 'A',
				speakerName: '医生 (ທ່ານໝໍ)',
				avatar: '👨‍⚕️',
				cn: '不用打针。吃点药，多喝热水，好好休息两天就会好的。',
				pinyin:
					'Bú yòng dǎzhēn. Chī diǎn yào, duō hē rèshuǐ, hǎohāo xiūxi liǎng tiān jiù huì hǎo de.',
				lao: 'ບໍ່ຕ້ອງສັກຢາ. ກິນຢາ, ດື່ມນ້ຳອຸ່ນຫຼາຍໆ, ພັກຜ່ອນດີໆ 2 ມື້ກໍຈະເຊົາແລ້ວ.'
			}
		],
		vocab: [
			{ word: '发烧', pinyin: 'fāshāo', lao: 'ເປັນໄຂ້' },
			{ word: '头疼', pinyin: 'tóuténg', lao: 'ເຈັບຫົວ' },
			{ word: '咳嗽', pinyin: 'késou', lao: 'ໄອ' },
			{ word: '感冒', pinyin: 'gǎnmào', lao: 'ເປັນຫວັດ' },
			{ word: '休息', pinyin: 'xiūxi', lao: 'ພັກຜ່ອນ' }
		]
	}
];
