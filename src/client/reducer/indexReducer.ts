const indexReducer = ( dataState: any, action: any ) =>
{
    console.log( 'click' )
    switch ( action.type )
    {
        case 'CHANGE_INDEX':
            console.log(action.payload)
            return {
                index: action.payload
            };
        default:
            return dataState;
    }
};

export default indexReducer
