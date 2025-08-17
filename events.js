
(()=>{
    let documentLength = document.querySelectorAll("*").length;
    let documentDefaultStyle = true;
    function applyEventCssRules(){
    let eventsStyleVar = `onabort,onblur,onfocus,oncancel,onauxclickv,onbeforeinput,onbeforetoggle,oncanplay,oncanplaythrough,onchange,onclick,onclose,oncontentvisibilityautostatechange,oncontextlost,oncontextmenu,oncontextrestored,oncopy,oncuechange,oncut,ondblclick,ondrag,ondragend,ondragenter,ondragexit,ondragleave,ondragover,ondragstart,ondrop,ondurationchange,onemptied,onended,onformdata,oninput,oninvalid,onkeydown,onkeypress,onkeyup,onload,onloadeddata,onloadedmetadata,onloadstart,onmousedown,onmouseenter,onmouseleave,onmousemove,onmouseout,onmouseover,onmouseup,onwheel,onpaste,onpause,onplay,onplaying,onprogress,onratechange,onreset,onresize,onscroll,onscrollend,onsecuritypolicyviolation,onseeked,onseeking,onselect,onslotchange,onstalled,onsubmit,onsuspend,ontimeupdate,onvolumechange,onwaiting,onselectstart,onselectionchange,ontoggle,onpointercancel,onpointerdown,onpointerup,onpointermove,onpointerout,onpointerover,onpointerenter,onpointerleave,ongotpointercapture,onlostpointercapture,onmozfullscreenchange,onmozfullscreenerror,onanimationcancel,onanimationend,onanimationiteration,onanimationstart,ontransitioncancel,ontransitionend,ontransitionrun,ontransitionstart,onwebkitanimationend,onwebkitanimationiteration,onwebkitanimationstart,onwebkittransitionend,onerror,onfullscreenchange,onfullscreenerror`.split(",");
    
    let style = document.querySelectorAll("link");
    let eventRun = [];
    
    let styleProper = "";
    let StyleSheets = "";
    
    style.forEach(async (style)=>{
    eventsStyleVar.forEach(async eventTarget=>{
        
        let get = await fetch(style.href);
        let href = await get.text(); 
    
    if(href.includes(`event-${eventTarget.substring("2")}`)){
        
        let eventChanger = `event-${eventTarget.substring("2")}`;
    
        href = href.trim().split("}").map(h=>`${h}}`)
        .filter(href=>href.includes(`${eventChanger});`))
        .map(href=>{
    
            let ref = href.substring(0,href.indexOf("{")).trim();
    
            let event = href.replaceAll("}","") 
            .substring(href.indexOf("{")+1)  
            .replaceAll(`,${eventChanger});`,"****___")
            .replaceAll(`, ${eventChanger});`,"****___")
            .split("___")
            .filter(href=>href.includes("****")?href:null)
            .map(href=>href.replaceAll("****","")
                           .substring(href.indexOf(";")+1)
                           .trim())
    
           .filter(ref=>ref!="")
           .map(ref=>ref.trim())
           .map(ref=>{
    
               if(ref.includes(":("))
                   return ref.replaceAll(":(",",")
               
               if(ref.includes(": ("))
                   return ref.replaceAll(": (",",")
           })
           .map(href=>href.split(","))
           .map(href=>{
    
            return href.map(href=>{
    
            let replace = href.substring(href.indexOf('"')+1,href.indexOf('" '))
            return href.replaceAll(replace,replace.replaceAll(" ","||"))
            })
    
           })
    
           let events = [...event];
    
        href
           return{
               ref:ref,
               event:events.map(e=>{
                   let before = e[1].replaceAll('"','').trim().split(" ");
                   let after = e[2].replaceAll('"','').trim().split(" ");
                   let name = e[0]
                   
                   if(name.includes(";")){
                    name = e[0].split("--").filter(e=>!e.includes(";"))
                    name = `--${name[0]}`
                   }
    
                   return{
                       name:name,
                       before:{hook:before[0].replaceAll("||"," "),proper:before[1]},
                       after:{hook:after[0].replaceAll("||"," "),proper:after[1]},
                       event:eventTarget.substring(2)
                   }
               })
           }
       
       })
      
       eventRun.push(...href);
    }
        })
    
    });
    
    (function(){setTimeout(async()=>{
    
       eventRun.forEach(text=>{
    
        styleProper = "";
        
        text.event.forEach(textEvent=>{
    
            styleProper+=`${textEvent.name}:${textEvent.before.proper};`;
    
            if(textEvent.before.hook!=textEvent.after.hook){
    
                document.querySelectorAll(`${textEvent.before.hook}`).forEach((all,range)=>{
    
                    document.querySelectorAll(`${text.ref}`)[range].style.setProperty(`${textEvent.name}`, textEvent.before.proper);
        
                    all.addEventListener(textEvent.event,()=>{
                        document.querySelectorAll(`${text.ref}`)[range].style.setProperty(`${textEvent.name}`, textEvent.before.proper);
                    })
            
                }) 
        
                document.querySelectorAll(`${textEvent.after.hook}`).forEach((all,range)=>{
        
                    all.addEventListener(textEvent.event,()=>{
                        document.querySelectorAll(`${text.ref}`)[range].style.setProperty(`${textEvent.name}`, textEvent.after.proper);  
                    })
            
                })
    
            }else{
    
                document.querySelectorAll(`${textEvent.before.hook}`).forEach((all,range)=>{
    
                    document.querySelectorAll(`${text.ref}`)[range].style.setProperty(`${textEvent.name}`, textEvent.before.proper);
                    let actionKey = false;
                    all.addEventListener(textEvent.event,()=>{
                        if(actionKey){     
                        document.querySelectorAll(`${text.ref}`)[range].style.setProperty(`${textEvent.name}`, textEvent.before.proper);
                        actionKey = false;
                        }
                        else{     
                        document.querySelectorAll(`${text.ref}`)[range].style.setProperty(`${textEvent.name}`, textEvent.after.proper);
                        actionKey = true;
                        };
                    });
    
                }); 
            };
        });
        StyleSheets += `${text.ref}{
            ${styleProper}
        }`;
    });
    
    if(documentDefaultStyle){
    let newStyle = document.createElement("style")
    document.querySelectorAll("head")[0].appendChild(newStyle)
    newStyle.innerHTML = StyleSheets;
    documentDefaultStyle = false;
    }
    },500)})();
    };
    applyEventCssRules();
     setInterval(()=>{
        let gear = true;
        const time = setInterval(()=>{
            if(gear){
                 
                if(documentLength!=document.querySelectorAll("*").length){
                    documentLength = document.querySelectorAll("*").length;
                    applyEventCssRules();
                    
                }
                 
                gear = false;
            }else{
                clearInterval(time);
                gear = true
        }
        },200)
    },200);
    
})()
document.querySelectorAll("aside")[0].addEventListener("click",()=>{
    document.querySelectorAll("article")[0].innerHTML+=`    
<section>
    <div class=" p5 br3 m1">new div</div>
<nav><button class="opens" type="button">open</button><button class="closes" type="button">close</button></nav>
</section>`;
});