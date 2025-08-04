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

    let sentences = text.match(/[^.!?]+[.!?]?/g) || [];
    let result = '';

    sentences.forEach(sentence => {
        if(!sentence.includes('___')){
            result += sentence;
            return;
        }
        let regex = /___/g;
        let match;
        let offset = 0;
        let modSentence = sentence;

        while((match = regex.exec(sentence)) != null){
            let pos = match.index;
            let start = pos + offset;
            let beforeT = modSentence.slice(0, start).trimEnd();     //Before the '___' part of the input sentence.
            let afterT = modSentence.slice(start + 3).trimStart();   //After the '___' part of the input sentence.

            let beforeD = nlp(beforeT);
            let beforeNs = beforeD.match('#Noun+').out('array');
            let beforeNP;
            if(beforeNs.length > 0) beforeNP = beforeNs[beforeNs.length - 1];   //Get noun phrase before the '___' part.
            else beforeNP = '';

            let afterD = nlp(afterT);
            let afterNP = afterD.match('#Value? #Noun+').out('text');
        
            let therecheck = false;
            let beforeW = beforeNP.toLowerCase().trim();
            if(beforeW == 'there') therecheck = true;
            let Icheck = false;
            if(beforeW == 'i') Icheck = true;
            let youcheck = false;
            if(beforeW == 'you') youcheck = true;

            let replace = 'is';
            if(Icheck) replace = 'am';
            else if(youcheck) replace = 'are';
            else if(therecheck){
                let Plural = nlp(afterNP).nouns().isPlural().out('boolean');
                if(Plural) replace = 'are';
            }
            else{
                let last = nlp(beforeT).sentences().last();
                let lastNs = last.nouns().out('array');
                let lastN;
                if(lastNs.length > 0) lastN = lastNs[lastNs.length - 1];
                else lastN = '';
                let Plural = nlp (lastN).nouns().isPlural().out('boolean');
                if(Plural) replace = 'are';
            }

            modSentence = modSentence.slice(0, start) + replace + modSentence.slice(start + 3);
            offset += replace.length - 3;
        }

        result += modSentence;
    })
    
    output.textContent = result;
    
}