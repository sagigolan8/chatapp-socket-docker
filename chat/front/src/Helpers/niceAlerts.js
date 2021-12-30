import Swal from 'sweetalert2'

export const niceAlert =  (titleVal,iconVal,time = 2000) => Swal.fire({
    position: 'center',
    icon: iconVal,
    title: titleVal,
    showConfirmButton: false,
    timer: time
  })