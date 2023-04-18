
// To Check Input Validation
export default function Validation(_firstname,_email){
    
    var validnameRegex  =  /^[a-zA-Z]+$/;
    var validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    
    if(validnameRegex.test(_firstname) && validEmailRegex.test(_email)){
        return true
    }else{
        return false
    }
};



