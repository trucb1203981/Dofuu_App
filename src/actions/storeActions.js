import { FETCH_STORE, FETCH_STORE_SUCCESS, FETCH_STORE_FAILURE, END_FETCH_STORE, DESTROY_FETCH_STORE} from '../api/constants'
import API from '../api/http'

function fetchStore() {
    return {
        type: FETCH_STORE
    }
}

function fetchStoreSuccess(data) {
    return {
        type  : FETCH_STORE_SUCCESS,
        stores: data.stores
    }
}

function endFetchStore() {   
    return {
        type: END_FETCH_STORE
    }
}

function getStoreFailure() {
    return {
        type: FETCH_STORE_FAILURE
    }
}

function destroyFetchStore() {
    return {
        type: DESTROY_FETCH_STORE
    }
}

export function fetchStoreFromAPI(payload) {
    return (dispatch, getState) => {
        if(!getState().store.isFetching && !getState().store.ended) {
            dispatch(fetchStore())
            const url  = `/Store/FetchStoresByType`
            const data = {cityId: payload.cityId, offset: payload.stores.length, typeId: payload.typeId}
            setTimeout(() => {
                API.post(url, data, { withCredentials:true }).then(response => {
                   
                    if(response.status === 200) {
                        if(response.data.stores.length>0) {                     
                            dispatch(fetchStoreSuccess(response.data))
                        } else {
                            dispatch(endFetchStore())
                        }
                    }
                }).catch(error => {
                    dispatch(getStoreFailure())
                })
            }, 500)            
        }
    }
}

export function defaultStore() {
    return (dispatch) => {
        dispatch(destroyFetchStore())
    }
}