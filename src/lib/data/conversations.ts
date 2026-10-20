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
	},
	{
		id: 'conv-7',
		titleCn: '谈论喜欢的颜色与挑选衣服',
		titlePinyin: 'Tánlùn xǐhuan de yánsè yǔ tiāoxuǎn yīfu',
		titleLao: 'ສົນທະນາກ່ຽວກັບສີທີ່ມັກ ແລະ ການເລືອກສີເສື້ອ',
		level: 1,
		category: 'ສີ',
		description: 'ບົດສົນທະນາຖາມ-ຕອບເລື່ອງສີທີ່ມັກ, ການເລືອກສີເສື້ອຜ້າ ເຊັ່ນ ສີແດງ, ສີຂາວ, ສີດຳ, ສີຟ້າ, ສີເຫຼືອງ',
		lines: [
			{
				speaker: 'A',
				speakerName: '小李 (Xiao Li)',
				avatar: '👩',
				cn: '你最喜欢什么颜色？',
				pinyin: 'Nǐ zuì xǐhuan shénme yánsè?',
				lao: 'ເຈົ້າມັກສີຫຍັງທີ່ສຸດ?'
			},
			{
				speaker: 'B',
				speakerName: '小王 (Xiao Wang)',
				avatar: '👨',
				cn: '我最喜欢蓝色和白色。你呢？',
				pinyin: 'Wǒ zuì xǐhuan lánsè hé báisè. Nǐ ne?',
				lao: 'ຂ້ອຍມັກສີຟ້າ ແລະ ສີຂາວທີ່ສຸດ. ເຈົ້າເດ?'
			},
			{
				speaker: 'A',
				speakerName: '小李 (Xiao Li)',
				avatar: '👩',
				cn: '我喜欢红色，因为红色很吉利。看，那件绿色的外套好看吗？',
				pinyin: 'Wǒ xǐhuan hóngsè, yīnwèi hóngsè hěn jílì. Kàn, nà jiàn lǜsè de wàitào hǎokàn ma?',
				lao: 'ຂ້ອຍມັກສີແດງ, ຍ້ອນວ່າສີແດງເປັນສີມຸງຄຸນ. ເບິ່ງແມ໋, ເສື້ອກັນໜາວສີຂຽວໂຕນັ້ນງາມບໍ່?'
			},
			{
				speaker: 'B',
				speakerName: '小王 (Xiao Wang)',
				avatar: '👨',
				cn: '挺好看的，不过我觉得黄色的衬衫更适合你。',
				pinyin: 'Tǐng hǎokàn de, búguò wǒ juéde huángsè de chènshān gèng shìhé nǐ.',
				lao: 'ງາມດີໃດ໋, ແຕ່ຂ້ອຍຄິດວ່າເສື້ອເຊີດສີເຫຼືອງເໝາະກັບເຈົ້າຫຼາຍກວ່າ.'
			},
			{
				speaker: 'A',
				speakerName: '小李 (Xiao Li)',
				avatar: '👩',
				cn: '真的吗？那我再试试这条黑色的裤子。',
				pinyin: 'Zhēn de ma? Nà wǒ zài shìshi zhè tiáo hēisè de kùzi.',
				lao: 'ແທ້ຫວາ? ຊັ້ນຂ້ອຍລອງໂສ້ງສີດຳໂຕນີ້ເບິ່ງອີກແດ່.'
			},
			{
				speaker: 'B',
				speakerName: '小王 (Xiao Wang)',
				avatar: '👨',
				cn: '黑色很百搭，穿起来显得很酷！',
				pinyin: 'Hēisè hěn bǎidā, chuān qǐlái xiǎnde hěn kù!',
				lao: 'ສີດຳເຂົ້າກັບທຸກສີໄດ້ງ່າຍ, ນຸ່ງແລ້ວເທ່ຫຼາຍ!'
			}
		],
		vocab: [
			{ word: '颜色', pinyin: 'yánsè', lao: 'ສີ / ສີສັນ' },
			{ word: '红色', pinyin: 'hóngsè', lao: 'ສີແດງ' },
			{ word: '蓝色', pinyin: 'lánsè', lao: 'ສີຟ້າ / ສີຄາມ' },
			{ word: '白色', pinyin: 'báisè', lao: 'ສີຂາວ' },
			{ word: '黑色', pinyin: 'hēisè', lao: 'ສີດຳ' },
			{ word: '绿色', pinyin: 'lǜsè', lao: 'ສີຂຽວ' },
			{ word: '黄色', pinyin: 'huángsè', lao: 'ສີເຫຼືອງ' }
		]
	},
	{
		id: 'conv-8',
		titleCn: '学习数数与大数字计算',
		titlePinyin: 'Xuéxí shǔshù yǔ dà shùzì jìsuàn',
		titleLao: 'ການນັບເລກ ແລະ ຕົວເລກໃຫຍ່ຮອດຫຼັກລ້ານ',
		level: 2,
		category: 'ນັບເລກຮອດລ້ານ',
		description: 'ບົດສົນທະນາຮຽນນັບຕົວເລກໃຫຍ່: ຫຼັກຮ້ອຍ (百), ຫຼັກພັນ (千), ຫຼັກໝື່ນ (万), ຫຼັກແສນ (十万), ຫຼັກລ້ານ (百万) ແລະ ຈຳນວນເງິນ',
		lines: [
			{
				speaker: 'A',
				speakerName: '留学生 (ນັກສຶກສາ)',
				avatar: '👨‍🎓',
				cn: '老师，中文里的大数字怎么数呢？比如一万是多少？',
				pinyin: 'Lǎoshī, zhōngwén lǐ de dà shùzì zěnme shǔ ne? Bǐrú yí wàn shì duōshao?',
				lao: 'ອາຈານ, ຕົວເລກໃຫຍ່ໃນພາສາຈີນນັບແນວໃດ? ຕົວຢ່າງວ່າ 1 ໝື່ນ (一万) ແມ່ນເທົ່າໃດ?'
			},
			{
				speaker: 'B',
				speakerName: '老师 (ອາຈານ)',
				avatar: '👩‍🏫',
				cn: '一万就是一千的十倍，也就是 10,000。中文习惯每四个零进一位。',
				pinyin: 'Yí wàn jiù shì yì qiān de shí bèi, yě jiù shì 10,000. Zhōngwén xíguàn měi sì gè líng jìn yí wèi.',
				lao: '1 ໝື່ນ (一万) ກໍຄື 10 ເທົ່າຂອງ 1 ພັນ, ເທົ່າກັບ 10,000. ພາສາຈີນມັກນັບທຸກໆເລກສູນ 4 ໂຕເປັນ 1 ຫຼັກ.'
			},
			{
				speaker: 'A',
				speakerName: '留学生 (ນັກສຶກສາ)',
				avatar: '👨‍🎓',
				cn: '原来是这样！那十万和一百万怎么说？',
				pinyin: 'Yuánlái shì zhèyàng! Nà shí wàn hé yì bǎi wàn zěnme shuō?',
				lao: 'ອໍ ເປັນແນວນີ້ເອງ! ແລ້ວ 1 ແສນ (十万) ກັບ 1 ລ້ານ (一百万) ເດ ເວົ້າແນວໃດ?'
			},
			{
				speaker: 'B',
				speakerName: '老师 (ອາຈານ)',
				avatar: '👩‍🏫',
				cn: '十个一万是十万 (100,000)，一百个一万就是一百万 (1,000,000)。',
				pinyin: 'Shí gè yí wàn shì shí wàn (100,000), yì bǎi gè yí wàn jiù shì yì bǎi wàn (1,000,000).',
				lao: '10 ເທື່ອຂອງ 1 ໝື່ນ ແມ່ນ 10 ໝື່ນ ຫຼື 1 ແສນ (十万: 100,000), ແລະ 100 ເທື່ອຂອງ 1 ໝື່ນ ກໍແມ່ນ 100 ໝື່ນ ຫຼື 1 ລ້ານ (一百万: 1,000,000).'
			},
			{
				speaker: 'A',
				speakerName: '留学生 (ນັກສຶກສາ)',
				avatar: '👨‍🎓',
				cn: '这辆汽车的价格大概是多少钱？',
				pinyin: 'Zhè liàng qìchē de jiàgé dàgài shì duōshao qián?',
				lao: 'ລົດໃຫຍ່ຄັນນີ້ລາຄາປະມານເທົ່າໃດ?'
			},
			{
				speaker: 'B',
				speakerName: '老师 (ອາຈານ)',
				avatar: '👩‍🏫',
				cn: '这辆车要二十五万八千元 (258,000元)，换算成老挝基普大约是八亿多基普。',
				pinyin: 'Zhè liàng chē yào èrshíwǔ wàn bā qiān yuán, huànsuàn chéng lǎowō jīpǔ dàyuē shì bā yì duō jīpǔ.',
				lao: 'ລົດຄັນນີ້ລາຄາ 258,000 ຢວນ (25 ໝື່ນ 8 ພັນ), ຄິດໄລ່ເປັນເງິນກີບລາວປະມານ 800 ກວ່າລ້ານກີບ (八亿多).'
			}
		],
		vocab: [
			{ word: '百', pinyin: 'bǎi', lao: 'ຮ້ອຍ (100)' },
			{ word: '千', pinyin: 'qiān', lao: 'ພັນ (1,000)' },
			{ word: '万', pinyin: 'wàn', lao: 'ໝື່ນ (10,000)' },
			{ word: '十万', pinyin: 'shí wàn', lao: 'ແສນ / ສິບໝື່ນ (100,000)' },
			{ word: '百万', pinyin: 'bǎi wàn', lao: 'ລ້ານ / ຮ້ອຍໝື່ນ (1,000,000)' },
			{ word: '千万', pinyin: 'qiān wàn', lao: 'ສິບລ້ານ (10,000,000)' },
			{ word: '亿', pinyin: 'yì', lao: 'ຮ້ອຍລ້ານ (100,000,000)' }
		]
	},
	{
		id: 'conv-9',
		titleCn: '收发快递与包裹查询',
		titlePinyin: 'Shōufā kuàidì yǔ bāoguǒ cháxún',
		titleLao: 'ການຮັບ-ສົ່ງພັດສະດຸດ່ວນ ແລະ ກວດສອບເລກພັດສະດຸ',
		level: 2,
		category: 'ການຂົນສົ່ງພັດສະດຸ',
		description: 'ບົດສົນທະນາການຕິດຕໍ່ຮັບເຄື່ອງພັດສະດຸຈາກພະນັກງານຂົນສົ່ງ ແລະ ກວດສອບເລກຕິດຕາມພັດສະດຸ (Tracking)',
		lines: [
			{
				speaker: 'A',
				speakerName: '快递员 (ພະນັກງານສົ່ງເຄື່ອງ)',
				avatar: '🛵',
				cn: '喂，您好！我是顺丰快递，有您的包裹到了。',
				pinyin: 'Wèi, nín hǎo! Wǒ shì shùnfēng kuàidì, yǒu nín de bāoguǒ dào le.',
				lao: 'ຮາໂຫຼ, ສະບາຍດີ! ຂ້ອຍແມ່ນພະນັກງານຂົນສົ່ງ SF Express, ມີພັດສະດຸຂອງເຈົ້າມາຮອດແລ້ວ.'
			},
			{
				speaker: 'B',
				speakerName: '收件人 (ຜູ້ຮັບ)',
				avatar: '🧑',
				cn: '你好！我现在不在家，可以帮我放在快递柜或者物业门卫室吗？',
				pinyin: 'Nǐ hǎo! Wǒ xiànzài bú zài jiā, kěyǐ bāng wǒ fàng zài kuàidìguì huòzhě wùyè ménwèishì ma?',
				lao: 'ສະບາຍດີ! ຕອນນີ້ຂ້ອຍບໍ່ຢູ່ເຮືອນ, ຊ່ວຍຝາກໄວ້ຕູ້ພັດສະດຸ (Locker) ຫຼື ປ້ອມຍາມໝູ່ບ້ານໄດ້ບໍ່?'
			},
			{
				speaker: 'A',
				speakerName: '快递员 (ພະນັກງານສົ່ງເຄື່ອງ)',
				avatar: '🛵',
				cn: '好的，我已经放进快递柜了。取件码是 8520，请注意查收短信。',
				pinyin: 'Hǎo de, wǒ yǐjīng fàng jìn kuàidìguì le. Qǔjiànmǎ shì 8520, qǐng zhùyì cháchōu duǎnxìn.',
				lao: 'ໂດຍ, ຂ້ອຍເອົາໃສ່ຕູ້ພັດສະດຸໃຫ້ແລ້ວ. ລະຫັດເອົາເຄື່ອງແມ່ນ 8520, ກະລຸນາກວດເບິ່ງຂໍ້ຄວາມ SMS ເດີ້.'
			},
			{
				speaker: 'B',
				speakerName: '收件人 (ຜູ້ຮັບ)',
				avatar: '🧑',
				cn: '太感谢了！另外我想寄一个包裹去云南，运费怎么算？',
				pinyin: 'Tài gǎnxiè le! Lìngwài wǒ xiǎng jì yí gè bāoguǒ qù Yúnnán, yùnfèi zěnme suàn?',
				lao: 'ຂອບໃຈຫຼາຍໆ! ອີກຢ່າງໜຶ່ງ ຂ້ອຍຢາກສົ່ງພັດສະດຸໄປແຂວງຢູນນານ, ຄ່າຂົນສົ່ງຄິດໄລ່ແນວໃດ?'
			},
			{
				speaker: 'A',
				speakerName: '快递员 (ພະນັກງານສົ່ງເຄື່ອງ)',
				avatar: '🛵',
				cn: '首重一公斤十二块，续重每公斤两块。您可以在手机上下单，我会上门取件。',
				pinyin: 'Shǒuzhòng yì gōngjīn shí\'èr kuài, xùzhòng měi gōngjīn liǎng kuài. Nín kěyǐ zài shǒujī shang xiàdān, wǒ huì shàngmén qǔjiàn.',
				lao: 'ກິໂລທຳອິດ 12 ຢວນ, ກິໂລຖັດໄປກິໂລລະ 2 ຢວນ. ທ່ານສາມາດກົດສັ່ງໃນມືຖືໄດ້, ຂ້ອຍຈະໄປຮັບເຄື່ອງເຖິງໜ້າບ້ານ.'
			},
			{
				speaker: 'B',
				speakerName: '收件人 (ຜູ້ຮັບ)',
				avatar: '🧑',
				cn: '好的，快递单号在哪里可以查到物流信息呢？',
				pinyin: 'Hǎo de, kuàidì dānhào zài nǎlǐ kěyǐ chá dào wùliú xìnxī ne?',
				lao: 'ໂດຍ, ເລກພັດສະດຸສາມາດກວດເບິ່ງຂໍ້ມູນການຂົນສົ່ງໄດ້ຢູ່ໃສ?'
			},
			{
				speaker: 'A',
				speakerName: '快递员 (ພະນັກງານສົ່ງເຄື່ອງ)',
				avatar: '🛵',
				cn: '用单号在微信小程序或者官网上都可以随时查询物流状态。',
				pinyin: 'Yòng dānhào zài wēixìn xiǎochéngxù huòzhě guānwǎng shang dōu kěyǐ suíshí cháxún wùliú zhuàngtài.',
				lao: 'ໃຊ້ເລກພັດສະດຸກວດເຊັກຜ່ານ WeChat mini-program ຫຼື ເວັບໄຊໄດ້ຕະຫຼອດເວລາ.'
			}
		],
		vocab: [
			{ word: '快递', pinyin: 'kuàidì', lao: 'ພັດສະດຸດ່ວນ / ຂົນສົ່ງດ່ວນ' },
			{ word: '快递员', pinyin: 'kuàidìyuán', lao: 'ພະນັກງານສົ່ງເຄື່ອງ' },
			{ word: '包裹', pinyin: 'bāoguǒ', lao: 'ພັດສະດຸ / ຫໍ່ເຄື່ອງ' },
			{ word: '运费', pinyin: 'yùnfèi', lao: 'ຄ່າຂົນສົ່ງ' },
			{ word: '单号', pinyin: 'dānhào', lao: 'ເລກຕິດຕາມພັດສະດຸ (Tracking No.)' },
			{ word: '取件码', pinyin: 'qǔjiànmǎ', lao: 'ລະຫັດຮັບເຄື່ອງ' },
			{ word: '物流', pinyin: 'wùliú', lao: 'ລະບົບໂລຈິສຕິກ / ການຂົນສົ່ງ' }
		]
	},
	{
		id: 'conv-10',
		titleCn: '在邮局寄信与国际包裹',
		titlePinyin: 'Zài yóujú jìxìn yǔ guójì bāoguǒ',
		titleLao: 'ການສົ່ງຈົດໝາຍ ແລະ ພັດສະດຸໄປຕ່າງປະເທດ ຢູ່ທີ່ໄປສະນີ',
		level: 2,
		category: 'ໄປສະນີ',
		description: 'ບົດສົນທະນາຢູ່ຫ້ອງການໄປສະນີ: ການສົ່ງຈົດໝາຍ, ການຊື້ສະແຕມ ແລະ ການສົ່ງພັດສະດຸລະຫວ່າງປະເທດ',
		lines: [
			{
				speaker: 'A',
				speakerName: '寄件人 (ຜູ້ສົ່ງ)',
				avatar: '👱‍♀️',
				cn: '你好！我想把这个包裹寄到老挝万象，请问怎么办理？',
				pinyin: 'Nǐ hǎo! Wǒ xiǎng bǎ zhè ge bāoguǒ jì dào Lǎowō Wànxiàng, qǐngwèn zěnme bànlǐ?',
				lao: 'ສະບາຍດີ! ຂ້ອຍຢາກສົ່ງພັດສະດຸຫໍ່ນີ້ໄປນະຄອນຫຼວງວຽງຈັນ ປະເທດລາວ, ຂໍຖາມແດ່ຕ້ອງເຮັດແນວໃດ?'
			},
			{
				speaker: 'B',
				speakerName: '邮局职员 (ພະນັກງານໄປສະນີ)',
				avatar: '👩‍💼',
				cn: '您好！请先放在秤上称一下重量……正好两公斤。请填写一下国际邮件详情单。',
				pinyin: 'Nín hǎo! Qǐng xiān fàng zài chèng shang chēng yíxià zhòngliàng…… Zhènghǎo liǎng gōngjīn. Qǐng tiánxiě yíxià guójì yóujiàn xiángqíngdān.',
				lao: 'ສະບາຍດີ! ກະລຸນາວາງເທິງຊິງຊັ່ງນ້ຳໜັກກ່ອນ…… ພໍດີ 2 ກິໂລ. ກະລຸນາຂຽນໃບລາຍລະອຽດພັດສະດຸລະຫວ່າງປະເທດແດ່.'
			},
			{
				speaker: 'A',
				speakerName: '寄件人 (ຜູ້ສົ່ງ)',
				avatar: '👱‍♀️',
				cn: '请问收件人地址和邮政编码写在哪里？',
				pinyin: 'Qǐngwèn shōujiànrén dìzhǐ hé yóuzhèng biānmǎ xiě zài nǎlǐ?',
				lao: 'ຂໍຖາມແດ່ ທີ່ຢູ່ຜູ້ຮັບ ແລະ ລະຫັດໄປສະນີຕ້ອງຂຽນໃສ່ບ່ອນໃດ?'
			},
			{
				speaker: 'B',
				speakerName: '邮局职员 (ພະນັກງານໄປສະນີ)',
				avatar: '👩‍💼',
				cn: '上面写寄件人信息，下面写收件人的姓名、地址和电话。邮政编码写在右上方。',
				pinyin: 'Shàngmiàn xiě jìjiànrén xìnxī, xiàmiàn xiě shōujiànrén de xìngmíng, dìzhǐ hé diànhuà. Yóuzhèng biānmǎ xiě zài yòushàngfāng.',
				lao: 'ດ້ານເທິງຂຽນຂໍ້ມູນຜູ້ສົ່ງ, ດ້ານລຸ່ມຂຽນຊື່, ທີ່ຢູ່ ແລະ ເບີໂທຜູ້ຮັບ. ລະຫັດໄປສະນີຂຽນໃສ່ເບື້ອງຂວາເທິງ.'
			},
			{
				speaker: 'A',
				speakerName: '寄件人 (ຜູ້ສົ່ງ)',
				avatar: '👱‍♀️',
				cn: '寄航空快递大概需要几天能到？',
				pinyin: 'Jì hángkōng kuàidì dàgài xūyào jǐ tiān néng dào?',
				lao: 'ສົ່ງແບບທາງອາກາດ (Airmail) ປະມານຈັກມື້ຈຶ່ງຮອດ?'
			},
			{
				speaker: 'B',
				speakerName: '邮局职员 (ພະນັກງານໄປສະນີ)',
				avatar: '👩‍💼',
				cn: '航空件大概五到七天，陆运或者海运大概需要半个月。',
				pinyin: 'Hángkōng jiàn dàyuē wǔ dào qī tiān, lùyùn huòzhě hǎiyùn dàgài xūyào bàn ge yuè.',
				lao: 'ສົ່ງທາງອາກາດປະມານ 5-7 ມື້, ຖ້າສົ່ງທາງບົກ ຫຼື ທາງເຮືອ ປະມານເຄິ່ງເດືອນ.'
			},
			{
				speaker: 'A',
				speakerName: '寄件人 (ຜູ້ສົ່ງ)',
				avatar: '👱‍♀️',
				cn: '好的，那我选航空件。顺便再买五张纪念邮票。',
				pinyin: 'Hǎo de, nà wǒ xuǎn hángkōng jiàn. Shùnbiàn zài mǎi wǔ zhāng jìniàn yóupiào.',
				lao: 'ໂດຍ, ຊັ້ນຂ້ອຍເລືອກສົ່ງທາງອາກາດ. ພ້ອມດຽວກັນນັ້ນ ຂໍຊື້ສະແຕມທີ່ລະນຶກ 5 ໃບແດ່.'
			}
		],
		vocab: [
			{ word: '邮局', pinyin: 'yóujú', lao: 'ຫ້ອງການໄປສະນີ' },
			{ word: '寄信', pinyin: 'jìxìn', lao: 'ສົ່ງຈົດໝາຍ' },
			{ word: '包裹', pinyin: 'bāoguǒ', lao: 'ພັດສະດຸ' },
			{ word: '重量', pinyin: 'zhòngliàng', lao: 'ນ້ຳໜັກ' },
			{ word: '邮政编码', pinyin: 'yóuzhèng biānmǎ', lao: 'ລະຫັດໄປສະນີ (Zip code)' },
			{ word: '地址', pinyin: 'dìzhǐ', lao: 'ທີ່ຢູ່' },
			{ word: '航空件', pinyin: 'hángkōng jiàn', lao: 'ພັດສະດຸທາງອາກາດ' },
			{ word: '邮票', pinyin: 'yóupiào', lao: 'ສະແຕມໄປສະນີ' }
		]
	}
];
