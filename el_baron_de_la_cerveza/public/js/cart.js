const BASE_URL = window.location.origin

    
    let $addToCart = document.querySelector('#addToCart')
    let $removeOne = document.querySelector('#removeOne')
    let $removeAll = document.querySelector('#removeAll')
    let $clearCart = document.querySelector('#clearCart')
    let $addToCartOk = document.querySelector('#addToCartOk')

    function addToCart (productId, quantity = 1, user){
        fetch(`${BASE_URL}/api/cart/${productId}/${quantity}/${user}`, {method: "POST"})
        .then(res => {
            if(res.ok){
                return res.json()
            }else{
                throw {
                    errorMsg: "Ocurrió un error"
                }
            }
        })
        .then(result => {
            if(result.status === 200 || result.status === 201){
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'center-center',
                    showConfirmButton: false,
                  })
                  
                  Toast.fire({
                    icon: 'success',
                    title: 'Producto agregado'
                  })
                window.location.reload()
            }
        })
        .catch(error => alert(`${error.errorMsg}`))
    }

    function removeOne (productId, user){
        fetch(`${BASE_URL}/api/cart/removeOne/${productId}/${user}`, {method: "DELETE"})
        .then(res => {
            if(res.ok){
                return res.json()
            }else{
                throw {
                    errorMsg: "Ocurrió un error"
                }
            }
        })
        .then(result => {
            if(result.status === 200){
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'center-center',
                    showConfirmButton: false,
                  })
                  
                  Toast.fire({
                    icon: 'info',
                    title: 'Producto eliminado'
                  })
                window.location.reload()
            }
        })
        .catch(error => alert(`${error.errorMsg}`))
    }

    function removeAll (productId, user){
        fetch(`${BASE_URL}/api/cart/removeAll/${productId}/${user}`, {method: "DELETE"})
        .then(res => {
            if(res.ok){
                return res.json()
            }else{
                throw {
                    errorMsg: "Ocurrió un error"
                }
            }
        })
        .then(result => {
            
            if(result.status === 200){
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'bottom-center',
                    showConfirmButton: false,
                  })
                  
                  Toast.fire({
                    icon: 'info',
                    title: 'Productos eliminados'
                  })
                window.location.reload()
            }
        })
        .catch(error => alert(`${error.errorMsg}`))
    }

    function clearCart (user){
        fetch(`${BASE_URL}/api/cart/clearCart/${user}`, {method: "DELETE"})
        .then(res => {
            if(res.ok){
                return res.json()
            }else{
                throw {
                    errorMsg: "Ocurrió un error"
                }
            }
        })
        .then(result => {
            
            if(result.status === 200){
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'bottom-center',
                    showConfirmButton: false,
                  })
                  
                  Toast.fire({
                    icon: 'info',
                    title: 'Carrito limpio'
                  })
                window.location.reload()
            }
        })
        .catch(error => alert(`${error.errorMsg}`))
    }

