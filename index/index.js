const app = getApp()
Page({
  data: {
  	cwidth: '',
    cheight: ''
  },
  onLoad() {
    this.ctx = wx.createCameraContext();
  },
  scancode(e){
    var that = this;
    console.log(e)
    const listener = this.ctx.onCameraFrame((frame) => {
      console.log(frame.data instanceof ArrayBuffer, frame.width, frame.height)
	  if(that.data.cwidth == '') {
        that.setData({
          cwidth: frame.width,
          cheight: frame.height
        })
      }
      listener.stop()
      var dwidth = frame.width
      var dheight = frame.height
      // if(frame.width <= 500) {
      //   dwidth = frame.width
      //   dheight = frame.height
      // } else if(frame.width > 500 && frame.width <= 900) {
      //   dwidth = frame.width*0.6
      //   dheight = frame.height*0.6
      // } else if(frame.width > 900) {
      //   dwidth = frame.width*0.3
      //   dheight = frame.height*0.3
      // }
      // var data = new Uint8Array(frame.data)
      var clamped = new Uint8ClampedArray(frame.data)
      wx.canvasPutImageData({
        canvasId: 'myCanvas',
        x: 0,
        y: 0,
        width: frame.width,
        height: frame.height,
        data: clamped,
        success (res) {
          wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: frame.width,
            height: frame.height,
            destWidth: dwidth,
            destHeight: dheight,
            fileType: 'png',
            quality: 1,
            canvasId: 'myCanvas',
            success(res) {
              console.log(res.tempFilePath)
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: (res) => {
                  console.log('保存成功')
                },
                fail: (res) => {
                  console.log(res)
                }
              })
            },
            fail:(res) => {
              console.log(res)
            }
          })
        },
        fail:(res) => {
          console.log(res)
        }
      }, that)
    })
    listener.start({
      success: (res) => {
        console.log("成功")
      },
      fail:(res) => {
        console.log(res)
      }
    })
  },
})
