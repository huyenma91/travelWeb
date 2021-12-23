jQuery(document).ready(function($) {
    const sections = document.querySelectorAll('section')
    const navLi = document.querySelectorAll('nav ul#nav li')
    window.addEventListener('scroll',()=>{
        let current = '';
        sections.forEach(section=>{
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if(pageYOffset >= sectionTop){
                current = section.getAttribute('id');
            }
        })
        navLi.forEach(li=>{
            li.classList.remove('current');
            if(li.classList.contains(current)){
                 li.classList.add('current')
            }
        })
    })
   
});
  
