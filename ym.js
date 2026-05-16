/**
 * AlgoForge — Яндекс.Метрика
 * Замените YANDEX_COUNTER_ID на ваш реальный номер счётчика.
 * Файл подключается на всех страницах сайта.
 */
(function(m,e,t,r,i,k,a){
    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);
})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");

ym(YANDEX_COUNTER_ID,"init",{
    clickmap:true,
    trackLinks:true,
    accurateTrackBounce:true,
    webvisor:true
});
