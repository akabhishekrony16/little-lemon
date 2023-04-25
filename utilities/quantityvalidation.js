export default function Validate_Quantity(_qty){
    
    var validqtyRegex  = /^[1-9]\d*$/;
    
    if(validqtyRegex.test(_qty)){
        return true
    }else{
        return false
    }
};