
function Square(props) {
    if(props.mark === null && props.canbemarked && props.playerturn !== 'o') return(
             <div className="squareFirst" {...props}><h2 className='mark'>{props.mark}</h2></div>
         )
    else if(props.mark === null && props.canbemarked && props.playerturn === 'o') return(
        <div className="squareSecond" {...props}><h2 className='mark'>{props.mark}</h2></div>
    )
    return (
        <div className="square" {...props}><h2 className='mark'>{props.mark}</h2></div>
    )
    
    
}

export default Square;