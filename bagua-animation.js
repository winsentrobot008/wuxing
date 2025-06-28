// bagua-animation.js

document.addEventListener('DOMContentLoaded', function() {
    const dynamicContainer = document.getElementById('bagua-dynamic-container');
    const staticContainer = document.getElementById('bagua-static-container');
    const svgElement = document.getElementById('animatedBagua');

    // 尝试获取SVG内部的关键动画元素
    const yinYang = svgElement ? svgElement.querySelector('#yin-yang-circle') : null;
    const trigrams = svgElement ? svgElement.querySelectorAll('.bagua-trigram') : null;

    // 判断是否能成功加载动态图的元素
    if (dynamicContainer && staticContainer && svgElement && yinYang && trigrams && trigrams.length > 0) {
        // 动态图元素都找到了，尝试启动动画
        console.log("Found dynamic Bagua elements. Attempting to start animation...");

        // 隐藏静态图，显示动态图
        staticContainer.classList.add('hidden');
        dynamicContainer.classList.remove('hidden'); // 确保动态图可见

        let yinYangAngle = 0;
        const trigramAngles = new Map();
        trigrams.forEach((trigram) => {
            trigramAngles.set(trigram, 0);
        });

        function animateBagua() {
            // 阴阳鱼的随机旋转
            const yinYangRotationSpeed = (Math.random() - 0.5) * 2; 
            yinYangAngle += yinYangRotationSpeed;
            yinYang.style.transform = `rotate(${yinYangAngle}deg)`;
            yinYang.style.transformOrigin = '50% 50%'; 

            // 每个卦象的随机旋转
            trigrams.forEach((trigram) => {
                const trigramRotationSpeed = (Math.random() - 0.5) * 1.5; 
                let currentAngle = trigramAngles.get(trigram) || 0;
                currentAngle += trigramRotationSpeed;
                trigramAngles.set(trigram, currentAngle);

                trigram.style.transform = `rotate(${currentAngle}deg)`;
                trigram.style.transformOrigin = '50% 50%'; 
            });

            requestAnimationFrame(animateBagua);
        }

        animateBagua();
        console.log("Bagua animation started.");

    } else {
        // 动态图元素未找到或不完整，显示静态图
        console.warn("Dynamic Bagua elements not found or incomplete. Displaying static image.");
        staticContainer.classList.remove('hidden'); // 确保静态图可见
        dynamicContainer.classList.add('hidden'); // 确保动态图隐藏
    }
});