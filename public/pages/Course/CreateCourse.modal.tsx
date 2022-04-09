// import { Button } from '@meroedu/components'
// import { Dialog, DialogActions, DialogContent, DialogContentText, DialogProps, DialogTitle, TextField } from '@mui/material'
// import React, { FC } from 'react'

// const CreateCourseModal:FC<any> = (props) => {
//     const descriptionElementRef = React.useRef<HTMLElement>(null)
//     React.useEffect(() => {
//         if (props.open) {
//         const { current: descriptionElement } = descriptionElementRef
//         if (descriptionElement !== null) {
//             descriptionElement.focus()
//         }
//         }
//     }, [open])
//     return (
//         <Dialog open={props.open} onClose={props.handleClose} scroll={props.scroll} aria-labelledby="scroll-dialog-title" aria-describedby="scroll-dialog-description" fullWidth={true} maxWidth="md" classes={{ paperFullScreen: "prePrint" }} fullScreen>
//         <DialogTitle id="scroll-dialog-title">Create Course</DialogTitle>
//         <DialogContent>
//           <DialogContentText id="scroll-dialog-description" ref={descriptionElementRef} tabIndex={-1}>
//             Courses are units that may contain multiple lessons which you can enroll your participants in.

//           </DialogContentText>
//           <TextField autoFocus margin="dense" id="name" label="Email Address" type="email" variant="standard" />
//         </DialogContent>
//         {/* <DialogActions>
//           <Button onClick={props.handleClose}>Cancel</Button>
//           <Button onClick={props.handleClose}>Subscribe</Button>
//         </DialogActions> */}
//       </Dialog>
//     )
// }

// export default CreateCourseModal