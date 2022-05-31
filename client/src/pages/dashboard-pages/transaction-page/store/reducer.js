import { fromJS } from "immutable";

const defaultState = fromJS({
    default:"default"
})

const returnNewStateToStore =(state=defaultState,action)=>{
    switch(action.type){
        default:
            return state
    }
}

export default returnNewStateToStore