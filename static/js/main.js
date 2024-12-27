document.addEventListener('DOMContentLoaded', function() {
    // Theme switcher
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    themeToggle.checked = savedTheme === 'dark';

    themeToggle.addEventListener('change', function() {
        const theme = this.checked ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });

    // Primary tag click handlers
    const primaryTags = document.querySelectorAll('.primary-tag');

    primaryTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const category = this.dataset.category;
            const secondaryTags = this.nextElementSibling;
            
            // Toggle active state of clicked primary tag
            const wasActive = this.classList.contains('active');
            
            // Remove active state from all primary tags
            primaryTags.forEach(t => {
                t.classList.remove('active');
                t.nextElementSibling.classList.remove('show');
            });

            // If the clicked tag wasn't active before, make it active
            if (!wasActive) {
                this.classList.add('active');
                secondaryTags.classList.add('show');
            }
        });
    });

    // Secondary tag click handlers
    const secondaryTags = document.querySelectorAll('.secondary-tag');
    
    secondaryTags.forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event from bubbling to primary tag
            
            // Remove active class from all secondary tags
            secondaryTags.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tag
            this.classList.add('active');
            
            // Update treatment info
            updateTreatmentInfo(this.dataset.organ);
        });
    });

    function updateTreatmentInfo(organName) {
        const treatmentInfo = document.getElementById('treatmentInfo');
        if (!treatmentInfo) return;

        // Get organ data
        const organData = getOrganData(organName);

        // Update treatment info with animation
        treatmentInfo.style.opacity = '0';
        treatmentInfo.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            treatmentInfo.innerHTML = `
                <div class="treatment-card">
                    <h3>${organName}治疗方案</h3>
                    <div class="treatment-section">
                        <h4>常见症状</h4>
                        <div class="symptoms">
                            ${organData.symptoms.map(symptom => 
                                `<span class="symptom-tag">${symptom}</span>`
                            ).join('')}
                        </div>
                    </div>
                    <div class="treatment-section">
                        <h4>中医诊断</h4>
                        <p>${organData.diagnosis}</p>
                    </div>
                    <div class="treatment-section">
                        <h4>推荐治疗</h4>
                        <div class="treatment-method">
                            ${organData.treatment}
                        </div>
                    </div>
                    <div class="treatment-section">
                        <h4>养生建议</h4>
                        <ul>
                            ${organData.advice.map(item => 
                                `<li>${item}</li>`
                            ).join('')}
                        </ul>
                    </div>
                </div>
            `;

            treatmentInfo.style.opacity = '1';
            treatmentInfo.style.transform = 'translateY(0)';
        }, 300);
    }

    function getOrganData(organName) {
        // Mock data - in a real application, this would come from your backend
        const organData = {
            '左耳': {
                symptoms: ['耳鸣', '听力减退', '耳痛', '眩晕', '耳内胀满', '分泌物异常'],
                diagnosis: '中医认为耳为肾之窍，耳部疾病多与肾精亏虚、肝火上扰有关。耳鸣可分为实证和虚证，实证多因肝火上扰，虚证多因肾精不足。',
                diseases: [
                    {
                        name: '耳鸣',
                        type: '虚证',
                        symptoms: '耳内持续或间歇性鸣响，疲劳后加重',
                        treatment: '补肾养精，健脾益气。\n服用六味地黄丸、归脾丸等。'
                    },
                    {
                        name: '中耳炎',
                        type: '实证',
                        symptoms: '耳痛剧烈，耳内胀满，可能有发热',
                        treatment: '清热解毒，消炎止痛。\n服用银翘散、双黄连口服液等。'
                    }
                ],
                treatment: '1. 针灸治疗：\n- 取听宫、翳风、耳门等穴位\n- 配合太溪、太冲等补肾泻肝穴位\n\n2. 中药调理：\n- 肾虚型：六味地黄丸\n- 肝火型：知柏地黄丸\n- 气血虚型：补气养血汤',
                advice: [
                    '保持作息规律，避免熬夜',
                    '适当运动，增强体质',
                    '控制音量，避免噪音环境',
                    '保持耳道清洁，预防感染',
                    '戒烟限酒，清淡饮食'
                ]
            },
            '心脏': {
                symptoms: ['心悸', '胸闷', '气短', '失眠', '多汗', '心律不齐', '面色苍白'],
                diagnosis: '心主血脉，心神所居。心气虚弱会导致血运不畅，心神不宁。常见心血虚、心气虚、心阴虚等证型。',
                diseases: [
                    {
                        name: '心悸',
                        type: '气虚证',
                        symptoms: '心跳加快，气短乏力，自汗，疲劳',
                        treatment: '益气养心，调节心律。\n服用归脾汤、酸枣仁汤等。'
                    },
                    {
                        name: '胸痹',
                        type: '血瘀证',
                        symptoms: '胸痛，痛处固定，夜间加重',
                        treatment: '活血化瘀，通络止痛。\n服用血府逐瘀汤、丹参滴丸等。'
                    }
                ],
                treatment: '1. 中药调理：\n- 气虚型：服用归脾汤\n- 阴虚型：天王补心丹\n- 血虚型：养心汤\n\n2. 穴位按摩：\n- 内关、神门、心俞等穴位\n- 每日按摩2-3次，每次10分钟',
                advice: [
                    '保持心情舒畅，避免情绪激动',
                    '适量运动，避免过度劳累',
                    '规律作息，保证充足睡眠',
                    '清淡饮食，避免刺激性食物',
                    '保持良好的生活习惯'
                ]
            },
            '肝脏': {
                symptoms: ['胁肋胀痛', '情志不畅', '目赤', '头痛', '口苦', '烦躁易怒'],
                diagnosis: '肝主疏泄，藏血养筋。肝气郁结会导致气机不畅，情志不舒；肝血不足则会出现筋脉失养等症状。',
                diseases: [
                    {
                        name: '肝郁气滞',
                        type: '气滞证',
                        symptoms: '胁肋胀痛，情志不畅，脘腹胀满',
                        treatment: '疏肝解郁，理气和胃。\n服用柴胡疏肝散、逍遥散等。'
                    },
                    {
                        name: '肝火上炎',
                        type: '实热证',
                        symptoms: '头痛眩晕，目赤肿痛，口苦咽干',
                        treatment: '清肝泻火，平肝潜阳。\n服用龙胆泻肝汤、天麻钩藤饮等。'
                    }
                ],
                treatment: '1. 中药调理：\n- 疏肝解郁：柴胡疏肝散\n- 养血柔肝：逍遥丸\n\n2. 穴位保健：\n- 期门、太冲等穴位\n- 配合艾灸调理',
                advice: [
                    '保持情志舒畅，避免暴怒',
                    '规律作息，不要熬夜',
                    '适当运动，促进气血运行',
                    '饮食有节，少食辛辣'
                ]
            },
            '肺': {
                symptoms: ['咳嗽', '气短', '胸闷', '痰多', '声音嘶哑', '易感冒'],
                diagnosis: '肺主气，司呼吸。肺气虚弱易导致卫外不固，感受外邪；痰湿内阻则气机不畅。',
                diseases: [
                    {
                        name: '感冒',
                        type: '风寒证',
                        symptoms: '恶寒发热，鼻塞流涕，咳嗽',
                        treatment: '疏风散寒，宣肺止咳。\n服用桑菊饮、银翘散等。'
                    },
                    {
                        name: '肺虚',
                        type: '气虚证',
                        symptoms: '气短乏力，声音低弱，易感冒',
                        treatment: '补肺益气，固表止汗。\n服用玉屏风散、生脉散等。'
                    }
                ],
                treatment: '1. 中药调理：\n- 补肺益气：玉屏风散\n- 止咳化痰：二陈汤\n\n2. 穴位保健：\n- 肺俞、定喘等穴位\n- 配合艾灸调理',
                advice: [
                    '注意保暖，预防感冒',
                    '适当运动，增强肺功能',
                    '保持室内空气流通',
                    '戒烟限酒，避免刺激'
                ]
            },
            '胃': {
                symptoms: ['胃痛', '消化不良', '嗳气', '反酸', '食欲不振', '恶心呕吐'],
                diagnosis: '胃主受纳腐熟，和降为顺。胃气虚弱会导致消化功能减退，气机失和则会出现胃痛等症状。',
                diseases: [
                    {
                        name: '胃痛',
                        type: '寒证',
                        symptoms: '胃部疼痛，喜温喜按，得食则缓解',
                        treatment: '温中散寒，和胃止痛。\n服用良姜散、吴茱萸汤等。'
                    },
                    {
                        name: '胃炎',
                        type: '热证',
                        symptoms: '胃脘灼痛，口干口苦，大便干结',
                        treatment: '清胃降火，和中止痛。\n服用清胃散、竹叶石膏汤等。'
                    }
                ],
                treatment: '1. 中药调理：\n- 健脾和胃：香砂六君子汤\n- 消化不良：保和丸\n\n2. 穴位保健：\n- 中脘、足三里等穴位\n- 配合艾灸调理',
                advice: [
                    '规律饮食，细嚼慢咽',
                    '不要暴饮暴食',
                    '避免过冷过热食物',
                    '保持心情愉悦',
                    '适当运动，促进消化'
                ]
            }
        };

        // Return default data if organ not found
        return organData[organName] || {
            symptoms: ['症状1', '症状2', '症状3'],
            diagnosis: `${organName}是人体重要器官，在中医理论中具有特殊的功能和作用。建议到专业中医医院进行详细诊断。`,
            diseases: [
                {
                    name: '常见病症',
                    type: '待确诊',
                    symptoms: '具体症状需要医生诊断',
                    treatment: '建议到专业中医医院就诊'
                }
            ],
            treatment: '建议到专业中医医院进行详细诊断和治疗。\n\n可以通过以下方式进行初步调理：\n1. 合理作息\n2. 调节饮食\n3. 适量运动',
            advice: [
                '保持良好的作息习惯',
                '注意饮食调养',
                '适量运动',
                '保持心情愉悦',
                '定期体检'
            ]
        };
    }

    // Canvas setup
    const canvas = document.getElementById('humanBodyCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawHumanBody(); // Redraw when resizing
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Draw human body outline with animation
    function drawHumanBody() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Calculate dimensions
        const bodyWidth = canvas.width * 0.3;
        const bodyHeight = canvas.height * 0.8;
        const x = (canvas.width - bodyWidth) / 2;
        const y = canvas.height * 0.1;

        ctx.strokeStyle = getComputedStyle(document.documentElement)
            .getPropertyValue('--text-color');
        ctx.lineWidth = 2;

        // Animate drawing
        animateDrawing([
            () => drawHead(x + bodyWidth/2, y, bodyWidth * 0.2),
            () => drawTorso(x, y + bodyWidth * 0.2, bodyWidth, bodyHeight * 0.4),
            () => drawArms(x, y + bodyWidth * 0.2, bodyWidth),
            () => drawLegs(x + bodyWidth * 0.2, y + bodyHeight * 0.5, bodyWidth * 0.6, bodyHeight * 0.5)
        ]);
    }

    function animateDrawing(drawFunctions, index = 0) {
        if (index >= drawFunctions.length) return;
        drawFunctions[index]();
        setTimeout(() => animateDrawing(drawFunctions, index + 1), 200);
    }

    function drawHead(x, y, radius) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.stroke();
    }

    function drawTorso(x, y, width, height) {
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.stroke();
    }

    function drawArms(x, y, width) {
        // Left arm
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - width * 0.2, y + width * 0.5);
        ctx.stroke();

        // Right arm
        ctx.beginPath();
        ctx.moveTo(x + width, y);
        ctx.lineTo(x + width * 1.2, y + width * 0.5);
        ctx.stroke();
    }

    function drawLegs(x, y, width, height) {
        // Left leg
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - width * 0.2, y + height);
        ctx.stroke();

        // Right leg
        ctx.beginPath();
        ctx.moveTo(x + width, y);
        ctx.lineTo(x + width * 1.2, y + height);
        ctx.stroke();
    }

    // Handle clicks on the canvas with hover effect
    let hoveredPart = null;
    
    canvas.addEventListener('mousemove', function(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const part = getBodyPart(x, y);
        if (part !== hoveredPart) {
            hoveredPart = part;
            drawHumanBody();
            if (part) {
                highlightBodyPart(part);
            }
        }
    });

    canvas.addEventListener('click', function(event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const part = getBodyPart(x, y);
        if (part) {
            updateOrganInfo(part);
        }
    });

    function getBodyPart(x, y) {
        // Add logic to determine which body part was clicked
        // Return the part name or null if no part was clicked
        return null;
    }

    function highlightBodyPart(part) {
        // Add logic to highlight the hovered body part
        ctx.save();
        ctx.globalAlpha = 0.3;
        // Add highlighting logic here
        ctx.restore();
    }

    function updateOrganInfo(organName) {
        const organInfo = document.getElementById('organInfo');
        if (!organInfo) return;

        // Add fade-out class
        organInfo.classList.remove('fade-in');
        
        // Simulate fetching organ data
        const organData = getOrganData(organName);
        
        setTimeout(() => {
            organInfo.innerHTML = `
                <h3>${organName}详细信息</h3>
                <p>${organData.description}</p>
                <div class="mt-4">
                    <h4>常见症状</h4>
                    <div class="disease-tags">
                        ${organData.symptoms.map(symptom => 
                            `<button class="disease-tag" data-symptom="${symptom}">${symptom}</button>`
                        ).join('')}
                    </div>
                </div>
            `;

            // Add click handlers for disease tags
            const diseaseTags = organInfo.querySelectorAll('.disease-tag');
            diseaseTags.forEach(tag => {
                tag.addEventListener('click', function() {
                    this.classList.toggle('selected');
                    updateSymptomInfo(this.dataset.symptom);
                });
            });

            // Add fade-in class
            organInfo.classList.add('fade-in');
        }, 300);
    }

    function updateSymptomInfo(symptom) {
        // Here you would typically fetch symptom data from the server
        // For now, we'll use mock data
        console.log(`Selected symptom: ${symptom}`);
    }

    function getOrganData(organName) {
        // Mock data - in a real application, this would come from your backend
        const organData = {
            '左耳': {
                description: '左耳是听觉器官，在中医理论中与肾经密切相关。',
                symptoms: ['耳鸣', '听力减退', '耳痛']
            },
            '右耳': {
                description: '右耳是听觉器官，在中医理论中与肾经密切相关。',
                symptoms: ['耳鸣', '听力减退', '耳痛']
            },
            '喉咙': {
                description: '喉咙是呼吸道的重要部分，与肺经相关。',
                symptoms: ['咽痛', '声音嘶哑', '咳嗽']
            },
            // Add more organs as needed
        };

        // Return default data if organ not found
        return organData[organName] || {
            description: `${organName}是人体重要器官，在中医理论中具有特殊的功能和作用。`,
            symptoms: ['症状1', '症状2', '症状3']
        };
    }

    // Organ tag click handlers
    const organTags = document.querySelectorAll('.organ-tag');
    organTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // Remove active class from all tags
            organTags.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tag
            this.classList.add('active');
            // Update organ info
            updateOrganInfo(this.dataset.organ);
        });
    });

    // Add CSS animation classes
    const style = document.createElement('style');
    style.textContent = `
        .fade-out {
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
        }
        .fade-in {
            opacity: 1;
            transform: translateY(0);
            transition: all 0.3s ease;
        }
    `;
    document.head.appendChild(style);

    // Add click event listener to all secondary tags
    document.querySelectorAll('.secondary-tag').forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            const organ = this.getAttribute('data-organ');
            updateOrganInfo(organ);
        });
    });

    function updateOrganInfo(organName) {
        const data = getOrganData(organName);
        
        // Update organ title
        document.querySelector('.organ-title').textContent = `${organName}相关信息`;
        
        // Update symptoms list
        const symptomsList = document.getElementById('symptoms-list');
        symptomsList.innerHTML = data.symptoms.map(symptom => `<li>${symptom}</li>`).join('');
        
        // Update diagnosis
        document.getElementById('diagnosis-text').textContent = data.diagnosis;
        
        // Update diseases list
        const diseasesList = document.getElementById('diseases-list');
        diseasesList.innerHTML = data.diseases.map(disease => `
            <div class="disease-card">
                <h4>${disease.name}</h4>
                <div class="disease-type">证型：${disease.type}</div>
                <div class="disease-symptoms">症状：${disease.symptoms}</div>
                <div class="disease-treatment">治疗：${disease.treatment}</div>
            </div>
        `).join('');
        
        // Update treatment text
        document.getElementById('treatment-text').textContent = data.treatment;
        
        // Update advice list
        const adviceList = document.getElementById('advice-list');
        adviceList.innerHTML = data.advice.map(advice => `<li>${advice}</li>`).join('');
    }

    function getOrganData(organName) {
        const organData = {
            '眼睛': {
                symptoms: ['视力模糊', '眼睛干涩', '眼疲劳', '畏光', '眼红', '眼痒'],
                diagnosis: '中医认为眼睛为肝之窍，与肝的功能密切相关。眼部疾病多与肝血不足、肝火上炎有关。',
                diseases: [
                    {
                        name: '干眼症',
                        type: '阴虚证',
                        symptoms: '眼睛干涩、异物感、易疲劳',
                        treatment: '滋阴养肝，润目明目。\n服用杞菊地黄丸、知柏地黄丸等。'
                    },
                    {
                        name: '结膜炎',
                        type: '风热证',
                        symptoms: '眼红、痒痛、多泪',
                        treatment: '疏风清热，明目退翳。\n服用银翘散、蒺藜决明丸等。'
                    }
                ],
                treatment: '1. 中药调理：\n- 滋阴明目：杞菊地黄丸\n- 清肝明目：明目地黄丸\n\n2. 穴位按摩：\n- 攒竹、睛明、太阳等穴位\n- 每日按摩2-3次',
                advice: [
                    '用眼卫生，经常眨眼',
                    '注意用眼时间，每隔1小时休息10分钟',
                    '保持良好的睡眠习惯',
                    '多食用对眼睛有益的食物，如胡萝卜、蓝莓等',
                    '避免长时间使用电子产品'
                ]
            },
            '鼻子': {
                symptoms: ['鼻塞', '流涕', '打喷嚏', '鼻痒', '嗅觉减退', '鼻出血'],
                diagnosis: '中医认为鼻为肺之窍，鼻部疾病与肺的功能密切相关。常见肺气虚弱、风寒侵袭等证候。',
                diseases: [
                    {
                        name: '过敏性鼻炎',
                        type: '肺卫不固证',
                        symptoms: '喷嚏连连，清涕如水，鼻痒',
                        treatment: '补肺固表，祛风通窍。\n服用玉屏风散、辛夷清肺饮等。'
                    },
                    {
                        name: '慢性鼻炎',
                        type: '肺气虚弱证',
                        symptoms: '鼻塞时轻时重，嗅觉减退',
                        treatment: '温肺化饮，通窍止涕。\n服用苍耳子散、辛夷散等。'
                    }
                ],
                treatment: '1. 中药调理：\n- 补肺固表：玉屏风散\n- 通窍止涕：辛夷散\n\n2. 穴位按摩：\n- 迎香、上星等穴位\n- 配合蒸汽熏蒸',
                advice: [
                    '保持室内空气清新',
                    '避免接触过敏原',
                    '适当运动，增强体质',
                    '保暖防寒，预防感冒',
                    '定期清洁鼻腔'
                ]
            },
            '口腔': {
                symptoms: ['口腔溃疡', '牙龈出血', '口干', '口苦', '口臭', '味觉改变'],
                diagnosis: '中医认为口腔问题多与脾胃、心火有关。口腔溃疡多因心火上炎，口干多因阴虚火旺。',
                diseases: [
                    {
                        name: '口腔溃疡',
                        type: '心火上炎证',
                        symptoms: '口腔疼痛，溃疡表面发白，周围红肿',
                        treatment: '清心泻火，养阴生津。\n服用玄参地黄汤、黄连上清丸等。'
                    },
                    {
                        name: '牙龈炎',
                        type: '胃火上炎证',
                        symptoms: '牙龈红肿出血，刷牙疼痛',
                        treatment: '清胃泻火，凉血止血。\n服用银花泡腾片、牙痛消炎灵等。'
                    }
                ],
                treatment: '1. 中药调理：\n- 清热解毒：黄连上清丸\n- 养阴生津：西瓜霜\n\n2. 穴位按摩：\n- 合谷、内庭等穴位\n- 每日漱口3-4次',
                advice: [
                    '保持口腔卫生，早晚刷牙',
                    '定期洗牙，预防牙周病',
                    '避免食用过烫过冷的食物',
                    '戒烟限酒',
                    '适当补充维生素C'
                ]
            },
            '心脏': {
                symptoms: ['心悸', '胸闷', '气短', '失眠', '多汗', '心律不齐', '面色苍白'],
                diagnosis: '心主血脉，心神所居。心气虚弱会导致血运不畅，心神不宁。常见心血虚、心气虚、心阴虚等证型。',
                diseases: [
                    {
                        name: '心悸',
                        type: '气虚证',
                        symptoms: '心跳加快，气短乏力，自汗，疲劳',
                        treatment: '益气养心，调节心律。\n服用归脾汤、酸枣仁汤等。'
                    },
                    {
                        name: '胸痹',
                        type: '血瘀证',
                        symptoms: '胸痛，痛处固定，夜间加重',
                        treatment: '活血化瘀，通络止痛。\n服用血府逐瘀汤、丹参滴丸等。'
                    }
                ],
                treatment: '1. 中药调理：\n- 气虚型：服用归脾汤\n- 阴虚型：天王补心丹\n- 血虚型：养心汤\n\n2. 穴位按摩：\n- 内关、神门、心俞等穴位\n- 每日按摩2-3次，每次10分钟',
                advice: [
                    '保持心情舒畅，避免情绪激动',
                    '适量运动，避免过度劳累',
                    '规律作息，保证充足睡眠',
                    '清淡饮食，避免刺激性食物',
                    '保持良好的生活习惯'
                ]
            },
            '肝脏': {
                symptoms: ['胁肋胀痛', '情志不畅', '目赤', '头痛', '口苦', '烦躁易怒'],
                diagnosis: '肝主疏泄，藏血养筋。肝气郁结会导致气机不畅，情志不舒；肝血不足则会出现筋脉失养等症状。',
                diseases: [
                    {
                        name: '肝郁气滞',
                        type: '气滞证',
                        symptoms: '胁肋胀痛，情志不畅，脘腹胀满',
                        treatment: '疏肝解郁，理气和胃。\n服用柴胡疏肝散、逍遥散等。'
                    },
                    {
                        name: '肝火上炎',
                        type: '实热证',
                        symptoms: '头痛眩晕，目赤肿痛，口苦咽干',
                        treatment: '清肝泻火，平肝潜阳。\n服用龙胆泻肝汤、天麻钩藤饮等。'
                    }
                ],
                treatment: '1. 中药调理：\n- 疏肝解郁：柴胡疏肝散\n- 养血柔肝：逍遥丸\n\n2. 穴位保健：\n- 期门、太冲等穴位\n- 配合艾灸调理',
                advice: [
                    '保持情志舒畅，避免暴怒',
                    '规律作息，不要熬夜',
                    '适当运动，促进气血运行',
                    '饮食有节，少食辛辣'
                ]
            }
        };

        // Return default data if organ not found
        return organData[organName] || {
            symptoms: ['暂无相关症状数据'],
            diagnosis: `${organName}是人体重要器官，建议到专业中医医院进行详细诊断。`,
            diseases: [
                {
                    name: '暂无疾病数据',
                    type: '待诊断',
                    symptoms: '具体症状需要医生诊断',
                    treatment: '建议到专业中医医院就诊'
                }
            ],
            treatment: '建议到专业中医医院进行详细诊断和治疗。',
            advice: [
                '保持良好的生活习惯',
                '规律作息',
                '均衡饮食',
                '适量运动',
                '定期体检'
            ]
        };
    }

    // Initialize Bootstrap components
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // User Profile Management
    const settingsForm = document.getElementById('settingsForm');
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    const changeAvatarBtn = document.querySelector('.change-avatar-btn');
    const avatarFileInput = document.createElement('input');
    avatarFileInput.type = 'file';
    avatarFileInput.accept = 'image/*';
    avatarFileInput.style.display = 'none';
    document.body.appendChild(avatarFileInput);

    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', function() {
            avatarFileInput.click();
        });

        avatarFileInput.addEventListener('change', async function(e) {
            const file = e.target.files[0];
            if (file) {
                const formData = new FormData();
                formData.append('avatar', file);

                try {
                    const response = await fetch('/api/profile/avatar', {
                        method: 'POST',
                        body: formData
                    });
                    const data = await response.json();
                    if (data.success) {
                        document.querySelector('.account-avatar').src = data.avatarUrl;
                        document.querySelector('.user-avatar').src = data.avatarUrl;
                        showToast('成功', '头像已更新');
                    } else {
                        showToast('错误', data.message || '更新头像失败');
                    }
                } catch (error) {
                    showToast('错误', '更新头像失败');
                }
            }
        });
    }

    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', async function() {
            const formData = new FormData(settingsForm);
            const settings = {
                username: formData.get('username'),
                currentPassword: formData.get('currentPassword'),
                newPassword: formData.get('newPassword'),
                confirmPassword: formData.get('confirmPassword'),
                emailNotifications: formData.get('emailNotifications') === 'on'
            };

            // Validate password change
            if (settings.newPassword || settings.confirmPassword) {
                if (!settings.currentPassword) {
                    showToast('错误', '请输入当前密码');
                    return;
                }
                if (settings.newPassword !== settings.confirmPassword) {
                    showToast('错误', '新密码与确认密码不匹配');
                    return;
                }
            }

            try {
                const response = await fetch('/api/profile/settings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(settings)
                });
                const data = await response.json();
                if (data.success) {
                    showToast('成功', '设置已更新');
                    if (data.username) {
                        document.querySelector('.user-name').textContent = data.username;
                    }
                    document.querySelector('#settingsModal').querySelector('.btn-close').click();
                } else {
                    showToast('错误', data.message || '更新设置失败');
                }
            } catch (error) {
                showToast('错误', '更新设置失败');
            }
        });
    }

    // Tag Management
    const addPrimaryTagBtn = document.getElementById('addPrimaryTagBtn');
    const addSecondaryTagBtn = document.getElementById('addSecondaryTagBtn');
    const primaryTagSelect = document.getElementById('primaryTagSelect');
    const saveTagsBtn = document.getElementById('saveTagsBtn');

    let tags = {
        primary: [],
        secondary: {}
    };

    // Load tags from server
    async function loadTags() {
        try {
            const response = await fetch('/api/tags');
            const data = await response.json();
            tags = data;
            updateTagsUI();
        } catch (error) {
            showToast('错误', '加载标签失败');
        }
    }

    function updateTagsUI() {
        // Update primary tags list
        const primaryTagsList = document.querySelector('.primary-tags-list');
        primaryTagsList.innerHTML = tags.primary.map(tag => `
            <div class="tag-item">
                <span>${tag}</span>
                <div class="tag-actions">
                    <button class="btn btn-sm btn-outline-primary edit-primary-tag" data-tag="${tag}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-primary-tag" data-tag="${tag}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Update primary tag select
        primaryTagSelect.innerHTML = '<option value="">选择一级标签</option>' +
            tags.primary.map(tag => `<option value="${tag}">${tag}</option>`).join('');

        // Update secondary tags list if a primary tag is selected
        const selectedPrimary = primaryTagSelect.value;
        if (selectedPrimary && tags.secondary[selectedPrimary]) {
            const secondaryTagsList = document.querySelector('.secondary-tags-list');
            secondaryTagsList.innerHTML = tags.secondary[selectedPrimary].map(tag => `
                <div class="tag-item">
                    <span>${tag}</span>
                    <div class="tag-actions">
                        <button class="btn btn-sm btn-outline-primary edit-secondary-tag" 
                                data-primary="${selectedPrimary}" data-tag="${tag}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-secondary-tag"
                                data-primary="${selectedPrimary}" data-tag="${tag}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }

        // Update main navigation
        updateMainNavigation();
    }

    function updateMainNavigation() {
        const navMenu = document.querySelector('.nav-menu');
        navMenu.innerHTML = tags.primary.map(primary => `
            <li class="nav-item dropdown">
                <a href="#" class="nav-link primary-tag" data-bs-toggle="dropdown">${primary}</a>
                <ul class="dropdown-menu">
                    ${(tags.secondary[primary] || []).map(secondary => `
                        <li><a class="dropdown-item secondary-tag" href="#" data-organ="${secondary}">${secondary}</a></li>
                    `).join('')}
                </ul>
            </li>
        `).join('');

        // Reattach event listeners for secondary tags
        document.querySelectorAll('.secondary-tag').forEach(tag => {
            tag.addEventListener('click', function(e) {
                e.preventDefault();
                const organ = this.getAttribute('data-organ');
                updateOrganInfo(organ);
            });
        });
    }

    if (addPrimaryTagBtn) {
        addPrimaryTagBtn.addEventListener('click', async function() {
            const newTag = document.getElementById('newPrimaryTag').value.trim();
            if (!newTag) return;

            try {
                const response = await fetch('/api/tags/primary', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ tag: newTag })
                });
                const data = await response.json();
                if (data.success) {
                    tags.primary.push(newTag);
                    tags.secondary[newTag] = [];
                    updateTagsUI();
                    document.getElementById('newPrimaryTag').value = '';
                    showToast('成功', '添加一级标签成功');
                }
            } catch (error) {
                showToast('错误', '添加标签失败');
            }
        });
    }

    if (addSecondaryTagBtn) {
        addSecondaryTagBtn.addEventListener('click', async function() {
            const primaryTag = primaryTagSelect.value;
            const newTag = document.getElementById('newSecondaryTag').value.trim();
            if (!primaryTag || !newTag) return;

            try {
                const response = await fetch('/api/tags/secondary', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        primaryTag,
                        secondaryTag: newTag
                    })
                });
                const data = await response.json();
                if (data.success) {
                    if (!tags.secondary[primaryTag]) {
                        tags.secondary[primaryTag] = [];
                    }
                    tags.secondary[primaryTag].push(newTag);
                    updateTagsUI();
                    document.getElementById('newSecondaryTag').value = '';
                    showToast('成功', '添加二级标签成功');
                }
            } catch (error) {
                showToast('错误', '添加标签失败');
            }
        });
    }

    // Event delegation for edit and delete buttons
    document.addEventListener('click', async function(e) {
        if (e.target.closest('.edit-primary-tag')) {
            const tag = e.target.closest('.edit-primary-tag').dataset.tag;
            const newTag = prompt('请输入新的标签名称：', tag);
            if (newTag && newTag !== tag) {
                try {
                    const response = await fetch('/api/tags/primary/' + encodeURIComponent(tag), {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ newTag })
                    });
                    const data = await response.json();
                    if (data.success) {
                        const index = tags.primary.indexOf(tag);
                        tags.primary[index] = newTag;
                        tags.secondary[newTag] = tags.secondary[tag];
                        delete tags.secondary[tag];
                        updateTagsUI();
                        showToast('成功', '更新标签成功');
                    }
                } catch (error) {
                    showToast('错误', '更新标签失败');
                }
            }
        }

        if (e.target.closest('.delete-primary-tag')) {
            const tag = e.target.closest('.delete-primary-tag').dataset.tag;
            if (confirm(`确定要删除"${tag}"及其所有二级标签吗？`)) {
                try {
                    const response = await fetch('/api/tags/primary/' + encodeURIComponent(tag), {
                        method: 'DELETE'
                    });
                    const data = await response.json();
                    if (data.success) {
                        const index = tags.primary.indexOf(tag);
                        tags.primary.splice(index, 1);
                        delete tags.secondary[tag];
                        updateTagsUI();
                        showToast('成功', '删除标签成功');
                    }
                } catch (error) {
                    showToast('错误', '删除标签失败');
                }
            }
        }

        if (e.target.closest('.edit-secondary-tag')) {
            const btn = e.target.closest('.edit-secondary-tag');
            const primaryTag = btn.dataset.primary;
            const tag = btn.dataset.tag;
            const newTag = prompt('请输入新的标签名称：', tag);
            if (newTag && newTag !== tag) {
                try {
                    const response = await fetch(`/api/tags/secondary/${encodeURIComponent(primaryTag)}/${encodeURIComponent(tag)}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ newTag })
                    });
                    const data = await response.json();
                    if (data.success) {
                        const index = tags.secondary[primaryTag].indexOf(tag);
                        tags.secondary[primaryTag][index] = newTag;
                        updateTagsUI();
                        showToast('成功', '更新标签成功');
                    }
                } catch (error) {
                    showToast('错误', '更新标签失败');
                }
            }
        }

        if (e.target.closest('.delete-secondary-tag')) {
            const btn = e.target.closest('.delete-secondary-tag');
            const primaryTag = btn.dataset.primary;
            const tag = btn.dataset.tag;
            if (confirm(`确定要删除"${tag}"吗？`)) {
                try {
                    const response = await fetch(`/api/tags/secondary/${encodeURIComponent(primaryTag)}/${encodeURIComponent(tag)}`, {
                        method: 'DELETE'
                    });
                    const data = await response.json();
                    if (data.success) {
                        const index = tags.secondary[primaryTag].indexOf(tag);
                        tags.secondary[primaryTag].splice(index, 1);
                        updateTagsUI();
                        showToast('成功', '删除标签成功');
                    }
                } catch (error) {
                    showToast('错误', '删除标签失败');
                }
            }
        }
    });

    // Toast notification function
    function showToast(title, message) {
        const toastContainer = document.querySelector('.toast-container') || createToastContainer();
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <div class="toast-header">
                <strong class="me-auto">${title}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">${message}</div>
        `;
        toastContainer.appendChild(toast);
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        toast.addEventListener('hidden.bs.toast', () => toast.remove());
    }

    function createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }

    // Initialize the page
    if (document.querySelector('.nav-menu')) {
        loadTags();
    }
});
