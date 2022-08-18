
function Square(props) {
    return(
        <div className="square" {...props}>{props.mark==='x'?'x':(props.mark==='o'?'o':'')}</div>
    )
}

export default Square;