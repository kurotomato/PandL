function filesel(){
    let fileBtn = document.getElementById('fileBtn');
    let fileIn = document.getElementById('fileIn');
    let textA = document.getElementById('textInput');

    fileBtn.addEventListener('click', () =>{
        fileIn.click();
    })

    fileIn.addEventListener('change', (e) =>{
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onload = function(event){
            textA.value = event.target.result;
        }
        reader.readAsText(file);
        fileIn.value = '';
    })
}

function setisare(){
    let text = document.getElementById('textInput').value;
    let output = document.getElementById('output');

    let regex = /___/g;
    let match;
    let offset = 0;
    let result = text;

    while((match = regex.exec(text)) != null){
        let pos = match.index;
        let start = pos + offset;
        let beforeT = result.slice(0, pos).trimEnd();     //Before the '___' part of the input sentence.
        let afterT = result.slice(pos + 3).trimStart();   //After the '___' part of the input sentence.

        let beforeD = nlp(beforeT);
        let beforeNs = beforeD.match('#Noun+').out('array');
        let beforeNP;
        if(beforeNs.length > 0) beforeNP = beforeNs[beforeNs.length - 1];   //Get noun phrase before the '___' part.
        else beforeNP = '';

        let afterD = nlp(afterT);
        let afterNs = afterD.match('#Noun+').out('array');
        let afterNP;
        if(afterNs.length > 0) afterNP = afterNs[0];                        //Get noun phrase after the '___' part.
        else afterNP = '';
        
        let therecheck = false;
        let beforeW = beforeNP.toLowerCase().split(/\s+/);
        if(beforeW.length == 1 && beforeW[0] == 'there') therecheck = true;
        let Icheck = false;
        if(beforeW.length == 1 && beforeW[0] == 'i') Icheck = true;
        let youcheck = false;
        if(beforeW.length == 1 && beforeW[0] == 'you') youcheck = true;

        let replace = 'is';
        if(Icheck) replace = 'am';
        else if(youcheck) replace = 'are';
        else if(therecheck){
            let Plural = nlp(afterNP).nouns().isPlural().out('boolean');
            if(Plural) replace = 'are';
        }
        else{
            let Plural = nlp (beforeNP).nouns().isPlural().out('boolean');
            if(Plural) replace = 'are';
        }

        result = result.slice(0, start) + replace + result.slice(start + 3);
        offset += replace.length - 3;
    }

    output.textContent = result;
}