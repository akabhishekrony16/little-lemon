
// To Check Input Validation
export default function Validation(_firstname,_email){
    
    var validnameRegex  =  /^[a-zA-Z]+$/;
    var validEmailRegex =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    
    if(validnameRegex.test(_firstname) && validEmailRegex.test(_email)){
        return true
    }else{
        return false
    }
};



