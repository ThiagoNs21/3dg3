async function builder(base,route) {
    let url = route.replaceAll('"',"");
    let elements = [];
    let finalHtml = "";
    let selects = "";
    let representation = "";
    let menuBtn = "";
    let counter = 0;
    function obj(arg, property = false, has = []){
        let element = structuredClone(base[arg]);
        if(element.key==undefined){
            if(property){
            if(element.attributes){
                for(let value in property){
                    if(element.attributes[value])
                    element.attributes[value].content = property[value];
                }
            }
            element.unique_key = `${arg}${counter}`;
            if(element.father){
            element.father = element.father[0]
            }
            if(element.child){
                element.child = element.child[0]
            }
            return element;
            }else{
                let response = {}
                console.log(element,element.selfClose)
                let selfClose = false;
                if(element.selfClose)selfClose = element.selfClose
                if(element.father){
                    if(element.child){
                        response = {
                            tag:structuredClone(base[arg]).tag,
                            nickname:structuredClone(base[arg]).nickname,
                            has:structuredClone(base[arg]).has,
                            unique_key : `${arg}${counter}`,
                            father:element.father[1],
                            child:element.child[1],
                            selfClose:selfClose,
                            close:true
                        }
                    }else{
                        response = {
                            tag:structuredClone(base[arg]).tag,
                            nickname:structuredClone(base[arg]).nickname,
                            has:structuredClone(base[arg]).has,
                            unique_key : `${arg}${counter}`,
                            father:element.father[1],
                            selfClose:selfClose,
                            close:true
                        }
                    }
                }else{
                    if(element.child){
                        response = {
                            tag:structuredClone(base[arg]).tag,
                            nickname:structuredClone(base[arg]).nickname,
                            has:structuredClone(base[arg]).has,
                            unique_key : `${arg}${counter}`,
                            child:element.child[1],
                            selfClose:selfClose,
                            close:true
                        }
                    }else{
                        response = {
                            tag:structuredClone(base[arg]).tag,
                            nickname:structuredClone(base[arg]).nickname,
                            has:structuredClone(base[arg]).has,
                            unique_key : `${arg}${counter}`,
                            selfClose:selfClose,
                            close:true
                        }
                    }
                }

                return response
            }
        }else{
            element.text = property;
            element.has = has;
            return element;
        }

    };

    function showTagContent(){
        document.querySelectorAll(".tagContent").forEach((tag,index)=>{
            let displayWatcher = true;
            tag.addEventListener("click",()=>{ 
               
               let child = document.querySelectorAll(".tagCurrent tag-content")[index];
    
                if(displayWatcher){     
                  child.style.display = "flex";
                  displayWatcher = false;
                }else{
                  child.style.display = "none";
                  displayWatcher = true;
                }
                 
            })
    
        });
    }

    function layout(elm){
        let {key,has,simple} = obj(elm)
        if(!key){
            elements.push(obj(elm,{}));
            if(has){
                has.forEach(add=>{
                    if(add=="content"){
                        let text = `novo texto`;
                        elements.push(obj(add,text,has));
                    }
                    else if(add=="src"){
                        elements.push(obj(add,"",has));
                    }else{
                        layout(add)
                    }
                })
            }
            if(!simple){
                elements.push(obj(elm));
            }
        }
    };

    function interface(elm){
        representation = "";
        elm.forEach((elm,index)=>{
            let event = ` onclick="menu(${index})"`
            let {tag,key,nickname,close,attribute,text,has,add,selfClose} = elm;
            if(!close&&!key){
                let tagContent = "";
                let tagCurrent = "";
                if(has.includes("content")){
                    tagContent = "tagContent";
                    tagCurrent = "tagCurrent"
                }
                let src = "";
                if(has.includes("src")){
                    if(elm.attributes.src.content.includes("/")){  
                        src = elm.attributes.src.content
                        src = src.split("").reverse().join().replaceAll(",","")
                        src = src.substring(0,src.indexOf("/")).split("").reverse().join().replaceAll(",","")
                        }else{
                            src = elm.attributes.src.content
                        }
                }
                representation += `
                 <tag-current class="${tagCurrent}">
                 <tag-open class="${tagContent}">${nickname}<tag-menu${event}><tag-content-inline>${src}</tag-content-inline><i class="bi bi-three-dots"></i></tag-menu></tag-open>`
            }
            if(close&&!key||selfClose&&close&&!key){
                representation+=`</tag-current>`;
            }
            if(key){  
                 representation+=`
                <tag-content${event}>${text}</tag-content>`
            }
            
        }); 
        
        counter++;
    }

    function preview(){

        let element = "";
        let proper = "";
        let sameProper = {};
        let attribute = "";
        elements.forEach(elm=>{
            let {tag,key,attributes,property,text,close,father,child} = elm;
            if(tag){
                if(attributes){
                    attribute = "";
                    for(let props in attributes){
                        if(property){
                        if(property[props]){
                            proper = "";
                            proper = `${property[props]} `;
                            sameProper[props] = props;
                        }

                        function __replaceText(w,r,n){

                            let text = w;
                            r.forEach((r)=>{
                                text = text.replaceAll(r,n);
                            })
                            return text
                        }

                        if(attributes[props].replace){    
                        let newText = __replaceText(attributes[props].content,attributes[props].replace.from,attributes[props].replace.to); 
                        attribute+=` ${props}="${proper}${newText}"`;
                        }else{  
                        attribute+=` ${props}="${proper}${attributes[props].content}"`;
                        }
                        proper = "";
                    }else{  
                        if(attributes[props].replace){   
                            let newText = __replaceText(attributes[props].content,attributes[props].replace.from,attributes[props].replace.to);  
                            attribute+=` ${props}="${newText}"`;
                        }else{
                            attribute+=` ${props}="${attributes[props].content}"`;
                        }
                        
                    }
                 }
                }
                if(property){
                    for(let props in property){
                        if(sameProper[props]==undefined){
                            proper+=` ${props}="${property[props]}"`
                        }
                    }
                }
                
                if(!close){
                    if(father){
                        element+=father
                    }
                    element+=`<${tag}${attribute}${proper}>`;
                    if(child){
                        element+=child
                    }
                    proper = "";
                    attribute = "";
                    sameProper = {};
                }else{  
                if(child){
                    element+=child
                }
                element+=`</${tag}>`;
                if(father){
                    element+=father
                }
                }
            }
            if(key){
                element+=text;
            }

        });

        finalHtml = element;
        console.log(finalHtml)
    };
 
    let children = [];

    for(let value in base){
        if(base[value].tag){
            if(base[value].has){
                base[value].has.forEach(has=>{
                    if(has!="content"||has!="src")children.push(has)
                })
            }
        }
    }

    let same = "";
    children = children.sort().filter(child=>{
        if(child!=same){
            same = child;
            return child;
        }
    });

    for(let value in base){
        if(base[value].tag){
            if(!children.includes(value)){
                let {nickname} = base[value]
                selects+=`<option value="${value}" class="width">${nickname}</option>`;
            }
        }
    }

    async function typeChoose(text,type,attr,options = []){

        let attributes = "";

        for(let props in attr){
            attributes+=` ${props}="${attr[props]}"`;
        };

        console.log("attr:",attributes);

        if(type=="text"){
            return `<input class="mainBtn attr"${attributes} value="${text}">`
        }
        if(type=="paragraph"){
            return `<textarea class="mainBtn"${attributes}>${text}</textarea>`
        }
        if(type=="option"){
            let option = "";
            options.forEach(opt=>{
                option+=`<option value="${opt}" class="mainBtn">${opt}</option>`
            })
            return `<select${attributes}>${option}</select>`
        }
        if(type=="img"){
            let option = "";
            let img = "";   
            let messenger = text!=""?text:"escolher imagem";
                fetch(`${url}image.json`).then(async ref=>{
                    let src = await ref.json();
                    src.forEach(src=>{
                        option+=`<option value="${src}" class="mainBtn">${src}</option>`
                        __static((imgSelects)=>{
                            imgSelects.html(option);
                            //console.log(option)
                            if(text!=""){
                                imgSelects.value(text);
                            }
                        })
                    })
                });

                window.getImg = async function (){
                    fetch(`${url}image.json`).then(async ref=>{
                        let src = await ref.json();
                        option = "";
                        img = "";
                        src.forEach(src=>{
                            option+=`<option value="${src}" class="width">${src}</option>`;
                               img+=`<img class="imgFit" src="${src}" alt="">`
                            __static((imgPreview,imgSelects,btnImgPreview)=>{
                                imgPreview.html(img).display("flex");
                                imgSelects.html(option);
                                __static((imgFit)=>{
                                    imgFit.click((imgFit)=>{
                                        let getImg = src.replaceAll("file:///h:/projetos/testes/","");
                                        console.log(getImg)
                                        imgSelects.value(getImg);
                                        btnImgPreview.text(getImg)
                                        imgPreview.display("none");
                                    })
                                });
                            });
                            
                        })
                    })
                }
                
                return `<nav id="iframeImgSelection">
                        <div id="imageGetter">
                        <iframe src="${url}imports.html" id="fileUploader" frameborder="0"></iframe>
                        <button type="button" id="btnImgPreview" class="mainBtn" onclick='getImg()'>${messenger}</button>
                        <select${attributes} class="mainBtn" id="imgSelects" style="display:none;" value="${messenger}"></select>
                        </div>
                        </nav>
                        `
            
           
        }

    }

    function hideTheOthers(){
        __static((summary,details,deletes)=>{

            let all = details;

            summary.click((details)=>{
                if(!details.dom.open){
                all.display("none");
                deletes.display("none");
                details.dom.style.display="flex";
            }else{
                all.display("flex");
                deletes.display("flex");
            }
            })

        })
    }

    window.menu = async function(int){
        let elm = elements[int];
        let {tag,text,attributes,has,add,open,close,type,options,unique_key} = elm;
        let edit = "";
        let insert = "";
        let replace = "";
        let selectOpt = "";
        let option = "";
        let addElementIndex = 0;
        let addElementObj = {};
        menuBtn = "";

        elements.forEach((elm,index)=>{
            if(elm.unique_key == unique_key&&elm.close){
                addElementIndex = index;
                addElementObj = elements[index];
            }
        })

        if(attributes){
            for(let proper in attributes){
                if(attributes[proper].type=="option"){
                    option = attributes[proper].options
                }
                 edit+=await typeChoose(attributes[proper].content,attributes[proper].type,{class:"attr",type:"text",name:proper,value:attributes[proper].content,placeholder:proper},option);
            };
        }
        if(text){ 
            if(type=="option"){option = options}
                 edit+=await typeChoose(text,type,{id:"textContent",type:"text",name:"content",value:text,placeholder:"texto"},option);
        }

            menuBtn+=`<details id="editSection"><summary class="mainBtn">editar</summary>${edit}<button class="mainBtn" id="edit" type="edit">editar</button></details>`;
/////////////////////////////////////////////////////////////////////////////////
            
        if(has){
            let length = has.length
           has.forEach(has=>{
            if(has!="content"&&close||has!="src"&&close){
                selectOpt+=`<option value="${has}" class="width">${base[has].nickname}</option>`;
            }
            if(!close){
            if(has=="content"&&tag!=undefined&&add[0]!="all"||has=="src"&&tag!=undefined&&add[0]!="all"){
                add.forEach(add=>selectOpt+=`<option value="${add}" class="width">${base[add].nickname}</option>`);
            }}
            if(add=="all"){
                selectOpt = selects
            }
           });

        }


        insert = "";
        insert = `<select id="insertOpt">${selectOpt}</select>`
        menuBtn+=`<details class="center" id="insertSection"><summary class="mainBtn">inserir</summary>${insert}<button class="mainBtn" id="insert" type="button">inserir</button></details>`;
///////////////////////////////////////////////////////////////////////////////// 
 
         replace = "";
         replace = `<select id="replaceOpt">${selectOpt}</select>`
         menuBtn+=`<details class="center" id="replaceSection"><summary class="mainBtn">substituir</summary>${replace}<button class="mainBtn" id="replace" type="button">substituir</button></details>`;

         
        let addSelectOpt = "";
        ((adds)=>{
            let display = "";
            let {tag,text,attributes,has,add,open,close,type,options,unique_key} = adds;
            if(has){
                let length = has.length
               has.forEach(has=>{
                if(has!="content"&&close||has!="src"&&close){
                    addSelectOpt+=`<option value="${has}" class="width">${base[has].nickname}</option>`;
                } 
                if(has.includes("content")&&has.length==1&&close||has.includes("src")&&close){
                    display = `style="display:none;"`
                }
               
                if(add=="all"){
                    addSelectOpt = selects
                }

                addSelectOpt = addSelectOpt.replaceAll('<option value="content" class="width"></option>',"")

               })
            }

            addElementConfig = "";
            addElementConfig = `<select id="addElementOpt">${addSelectOpt}</select>`;
            menuBtn+=`<details ${display} class="center " id="addElementSection"><summary class="mainBtn">adicionar</summary>${addElementConfig}<button class="mainBtn" id="addElementBtn" type="button">adicionar</button></details>`;
            
        })(addElementObj);

////////////////////////////////////////////////////////////////////////////////

         menuBtn+=`<button id="deletes" type="button">deletar</button>`;
            __static((action)=>{

                action.html(menuBtn)
                .display("flex");

                hideTheOthers();

                selectOpt = "";
                if(has){
                    has.forEach(has=>{
                     if(has=="content"&&tag==undefined||has=="src"&&tag==undefined){
                        __static((insertSection)=>{
                            insertSection.display("none");
                        });
                        __static((replaceSection)=>{
                            replaceSection.display("none");
                        })
                     }
                     
                    })
                 }

                 if(close){
                    __static((editSection)=>{
                        editSection.display("none");
                    })
                    __static((replaceSection)=>{
                        replaceSection.display("none");
                    });
                   if(has[0]!="content"||has[0]!="src"){
                    __static((deletes)=>{
                        deletes.display("none");
                    });
                   }
                 }

                 if(tag&&!attributes){
                    __static((editSection)=>{
                        editSection.display("none");
                    })
                 }

                __static((edit)=>{
                    edit.click((elementRepresentation)=>{
                        document.querySelectorAll(".attr").forEach((attr)=>{
                            elm.attributes[attr.name].content = attr.value ;
                            console.log("src:",attr,elm.attributes[attr.name].content,attr.value)
                        });
                        if(text)
                            elm.text = document.querySelector("#textContent").value;
                        interface(elements);
                        preview(elements);
                        elementRepresentation.html(representation);
                        action.display("none");
                        showTagContent();
                        
            let elementData = JSON.stringify(elements);
            localStorage.setItem("lastData",elementData);
                    })
                });

                __static((insert)=>{
                    insert.click((insert,insertOpt,elementRepresentation)=>{
                        
                        let temp = [];
                        let insertLayout = (inserts)=>{
                            let {key,has,simple} = obj(inserts);
                        if(!key){
                            temp.push(obj(inserts,{}));
                            if(has){
                                has.forEach(add=>{
                                    if(add=="content"){
                                        let text = `novo texto`;
                                        temp.push(obj(add,text,has));
                                    }
                                    else if(add=="src"){
                                        temp.push(obj(add,"",has));
                                    }else{
                                        insertLayout(add)
                                    }
                                })
                            }
                            if(!simple){
                                temp.push(obj(inserts));
                            }
                            
                            action.display("none");
        
                        }}
                        insertLayout(insertOpt.dom.value);
                        
                        elements[int] = [temp,elm].flat();
                        elements[int] = elements[int].flat();
                        elements = elements.flat();
                        
                        interface(elements);
                        preview(elements);
                        elementRepresentation.html(representation);
                        temp = [];
                        showTagContent();
                        
            let elementData = JSON.stringify(elements);
            localStorage.setItem("lastData",elementData);
                    })
                });

                function addElementFunc(elm,index){
                    __static((addElementBtn)=>{
                        addElementBtn.click((addElementBtn,addElementOpt,elementRepresentation)=>{
                            
                            let temp = [];
                            let addElementLayout = (inserts)=>{
                                let {key,has,simple} = obj(inserts);
                            if(!key){
                                temp.push(obj(inserts,{}));
                                if(has){
                                    has.forEach(add=>{
                                        if(add=="content"){
                                            let text = `novo texto`;
                                            temp.push(obj(add,text,has));
                                        }
                                        else if(add=="src"){
                                            temp.push(obj(add,"",has));
                                        }else{
                                            addElementLayout(add)
                                        }
                                    })
                                }
                                if(!simple){
                                    temp.push(obj(inserts));
                                }
                                
                                action.display("none");
            
                            }}
                            addElementLayout(addElementOpt.dom.value);
                            
                            elements[index] = [temp,elm].flat();
                            elements[index] = elements[index].flat();
                            elements = elements.flat();
                            
                            interface(elements);
                            preview(elements);
                            elementRepresentation.html(representation);
                            temp = [];
                            showTagContent();
                            
                         let elementData = JSON.stringify(elements);
                         localStorage.setItem("lastData",elementData);
                        })
                    });
                }

                addElementFunc(addElementObj,addElementIndex);

///////////////////////////////////////////////////////////////

                __static((replace)=>{
                    replace.click((replace,replaceOpt,elementRepresentation)=>{
                        
                        let temp = [];
                        let replaceLayout = (replaces)=>{
                            let {key,has,simple} = obj(replaces);
                        if(!key){
                            temp.push(obj(replaces,{}));
                            if(has){
                                has.forEach(add=>{
                                    if(add=="content"){
                                        let text = `novo texto`;
                                        temp.push(obj(add,text,has));
                                    }
                                    else if(add=="src"){
                                        temp.push(obj(add,"",has));
                                    }else{
                                        replaceLayout(add)
                                    }
                                })
                            }
                            if(!simple){
                                temp.push(obj(replaces));
                            }
                            
                            action.display("none");
        
                        }}
                        replaceLayout(replaceOpt.dom.value);
                        
                        elements = elements.flat();
                        
                        let id = elements[int].unique_key;
                        let index = int;
                        let range = 0;
                        let before = [];
                        let after = [];
                       elements.map((e,i)=>{
                           if(e.unique_key!=undefined)
                           if(e.unique_key == id&&i > index){
                               range = i;
                           }
                       })
                       elements.forEach((e,i)=>{

                           if(i<index)
                               before.push(e)
                           
                           if(i>range)
                            after.push(e)

                       });

                       elements = [...before,...temp,...after];
                        interface(elements);
                        preview(elements);
                        elementRepresentation.html(representation);
                        temp = [];
                        showTagContent();
                        
            let elementData = JSON.stringify(elements);
            localStorage.setItem("lastData",elementData);
                    })
                });

                __static((deletes,action,elementRepresentation)=>{

                    deletes.click((deletes)=>{
                        elements = elements.flat();
                        
                        let id = elements[int].unique_key;
                        let index = int;
                        let range = 0;
                       elements.map((e,i)=>{
                           if(e.unique_key!=undefined)
                           if(e.unique_key == id&&i > index){
                               range = i;
                           }
                       })
                       elements = elements.filter((e,i)=>{

                           if(i<index||i>range){
                               return e;
                           }

                       });
                        interface(elements);
                        preview(elements);
                        elementRepresentation.html(representation);
                        
            let elementData = JSON.stringify(elements);
            localStorage.setItem("lastData",elementData);;
                        
                        action.display("none");
                        showTagContent();
                    })

                })
        })
    }

    __static((html,elementRepresentation,btnAction,opt,btnPreview,elementPreviewSection,btnPreviewClose,btnShowCreationMenu,creationMenu,navMenu,btnClear)=>{

        opt.html(selects)
        btnAction.click((opt,action)=>{
            layout(opt.dom.value);
            interface(elements);
            preview(elements);
            elementRepresentation.html(representation);
            creationMenu.display("none");
            navMenu.display("flex");
            showTagContent();
            //console.log(finalHtml);
            
            let elementData = JSON.stringify(elements);
            localStorage.setItem("lastData",elementData);
        })

        btnPreview.click((btnPreview,elementPreview)=>{
            elementPreview.html(finalHtml)
            elementPreviewSection.display("flex")
            btnPreviewClose.display("flex")
            btnPreview.display("none")
            navMenu.display("none")
        })
        btnPreviewClose.click((btnPreview,elementPreview)=>{
            elementPreview.html(finalHtml)
            elementPreviewSection.display("none")
            btnPreviewClose.display("none")
            btnPreview.display("flex")
            navMenu.display("flex")
        })
        
        btnShowCreationMenu.click((btnShowCreationMenu)=>{
            creationMenu.display("flex")
            navMenu.display("none")
        });

    if(localStorage.getItem("lastData")!=null){
    let lastData = JSON.parse(localStorage.getItem("lastData"));
    elements = structuredClone(lastData);
    interface(elements);
    preview(elements); 
    elementRepresentation.html(representation);
    }

    html.click(bg=>{
        document.querySelector("html").requestFullscreen();
    });
    
    btnClear.click((btnClear)=>{
        elements = [];
        localStorage.setItem("lastData","");
        elementRepresentation.html("");})

    });

    showTagContent()

}

let links = ["base.json"];

(async function(arguments) {
    let url = "";
    //fetch("http://localhost:9090/server").then(async server=>{
    //    if(server.status = 200)
    //    url = await server.text();
    //})
    arguments.forEach(arguments => {
        fetch(`${arguments}`)
        .then(async base=>{
            if(base.status == 200){ 
                let response = await base.json();
             builder(response,url);
            }
        })
    });
})(links);
