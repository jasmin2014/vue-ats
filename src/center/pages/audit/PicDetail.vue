<!--picDetail 资产标的图片-->
<template>
  <div class="audit-pic">
    <el-row class="mgt20">
      <el-table :data="detail" border>
        <el-table-column prop="loanApplicationNo" label="借贷编号" align="center"></el-table-column>
        <el-table-column prop="assetChannel" label="资产渠道" align="center"></el-table-column>
        <el-table-column prop="loanPartyKind" label="主体性质" align="center"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.SUBJECT_PROP, this.$enum.SUBJECT_PROP))"></el-table-column>
        <el-table-column prop="assetKind" label="资产类型" align="center"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE))"></el-table-column>
        <el-table-column prop="loanKind" label="项目名称" align="center"
                         :formatter="(row, col, val) => (this.$filter(val, this.$enum.LOAN_TYPE, row.assetKind))"></el-table-column>
        <el-table-column prop="appliedTime" label="申请日期" align="center"></el-table-column>
      </el-table>
    </el-row>


    <div class="wrapper">
      <h4>
        <span>资料原图</span>
      </h4>
      <h4>
        <span>处理后</span>
      </h4>
      <ul class="list">
        <li v-for="item in picList">
          <div class="pic-item" :class="!item.mosaic ? '' : 'is-done-mosaic'">
            <img :src="item.origin.uri" :alt="item.origin.name" crossorigin="anonymous"/>
            <span class="actions">
              <i class="fa fa-edit"
                 @click="handleEditPic(item.origin)"></i>
              <i class="el-icon-zoom-in" @click="handlePreview(item.origin)"></i>
            </span>
          </div>
          <div class="pic-item" v-if="item.mosaic">
            <img :src="item.mosaic.uri" :alt="item.mosaic.name"/>
            <span class="actions">
              <i class="el-icon-zoom-in" @click="handlePreview(item.mosaic)"></i>
            </span>
          </div>
        </li>
      </ul>
    </div>

    <el-dialog title="图片处理" :visible.sync="showDialog" width="1000px"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :before-close="handleBeforeDialogClose"
               @open="handleDialogOpen"
               @close="handleDialogClose">
      <el-row type="flex" justify="space-between">
        <el-col :span="12">
          <el-button type="primary" @click="handleSave">保存</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </el-col>
        <el-col :span="2" style="text-align: right; line-height: 40px; padding-right: 10px;">
          模糊尺寸
        </el-col>
        <el-col :span="6">
          <el-slider v-model="mosaicSize"
                     :step="5" :min="5" :max="50" :format-tooltip="formatTooltip"></el-slider>
        </el-col>
        <el-col :span="3" :offset="1">
          <el-button @click="handleUndo">撤销</el-button>
        </el-col>
      </el-row>
      <div ref="canvasContainer" class="canvas-container" v-loading="isLoadingImage">
        <canvas ref="canvas" width="960" height="500"></canvas>
        <canvas ref="layer" class="layer" width="960" height="500"></canvas>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getPicDetail, saveMosaicPic} from '../../api/audit'
  import {postQiniu} from '../../../api/common';

  export default {
    data() {
      return {
        id: this.$route.params.id,
        detail: [],
        picList: [],
        currentOrigin: {},
        showDialog: false,
        isDoneMosaic: false,
        isLoadingImage: false,
        isSavingPic: false,
        paintHistory: [],
        ratio: 1,
        mosaicSize: 10
      };
    },
    created() {
      this.getData(this.id);
    },
    methods: {
      // 编辑原图
      handleEditPic(origin) {
        this.currentOrigin = origin;
        this.showDialog = true;
      },
      // 预览
      handlePreview(file) {
        this.$preview([{
          url: file.uri,
          name: file.name
        }]);
      },
      handleDialogOpen() {
        this.$nextTick(() => {
          this.isLoadingImage = true;
          this.loadImage(this.currentOrigin.uri, () => {
            this.bindEvent(this.$refs.canvas, this.$refs.layer);
          });
        })
      },
      handleBeforeDialogClose(done) {
        if (this.isSavingPic) {
          this.$message({
            message: '正在保存，请稍后操作',
            type: 'warning'
          });
        } else {
          done();
        }
      },
      handleDialogClose() {
        this.currentOrigin = {};
        this.isDoneMosaic = false;
        this.paintHistory = [];
        this.$refs.canvasContainer.classList.remove('no-pic');
        this.resetCanvas(this.$refs.canvas);
        this.resetCanvas(this.$refs.layer);
        this.unbindEvent(this.$refs.layer);
      },
      handleSave() {
        if (this.isSavingPic) {
          this.$message({
            message: '正在保存，请稍后操作',
            type: 'warning'
          });
          return;
        }
        const url = this.$refs.canvas.toDataURL(this.currentOrigin.type);
        const blob = this.$dataURL2Blob(url);
        const fileType = blob.type.replace('image/', '');
        // 保存图片到七牛
        this.isSavingPic = true;
        postQiniu({
          file: blob,
          filename: this.currentOrigin.name,
          token: this.$store.state.qiniu
        }).then((response) => {
          const res = response.data;
          // 保存打码图片
          saveMosaicPic(this.id, this.currentOrigin.proofMaterial, {
            fileUri: res.key,
            fileType: this.currentOrigin.type || fileType,
            name: this.currentOrigin.name
          }).then(({data, status}) => {
            this.isSavingPic = false;
            if (status === 201) {
              this.$message({
                message: '保存成功',
                type: 'success'
              });
              this.getData(this.id);
              this.showDialog = false;
            } else {
              this.$message.error(data.message);
              this.showDialog = false;
            }
          }, ({data}) => {
            this.isSavingPic = false;
            this.$message.error(data.message);
            this.showDialog = false;
          });
        }, () => {
          this.isSavingPic = false;
        })
      },
      handleCancel() {
        if (this.isSavingPic) {
          this.$message({
            message: '正在保存，请稍后操作',
            type: 'warning'
          });
        } else {
          this.showDialog = false;
        }
      },
      // 撤销
      handleUndo() {
        if (this.paintHistory.length === 0) {
          return;
        }
        this.paintHistory.pop();
        if (this.paintHistory.length === 0) {
          this.isDoneMosaic = false;
        }
        this.clearCanvas(this.$refs.canvas);
        this.clearCanvas(this.$refs.layer);
        // 重新绘制剩余打码记录
        this.loadImage(this.currentOrigin.uri, () => {
          const canvasCtx = this.$refs.canvas.getContext('2d');
          canvasCtx.fillStyle = '#2c3e50';
          canvasCtx.beginPath();
          this.paintHistory.forEach((history) => {
            this.drawRect(canvasCtx, history.x, history.y, history.width, history.height, true);
            canvasCtx.fill()
          });
        });
      },
      bindEvent(canvas, layer) {
        let isDown = false;
        let isLeave = false;
        const layerCtx = layer.getContext('2d');
        const canvasCtx = canvas.getContext('2d');
        let startPoint = {};
        let leavePoint = {};
        layer.onmousedown = (e) => {
          isDown = true;
          layerCtx.strokeStyle = '#d606ff';
          layerCtx.lineWidth = 2 * this.ratio;
          canvasCtx.fillStyle = '#2c3e50';
          startPoint = {x: Math.round(e.offsetX * this.ratio), y: Math.round(e.offsetY * this.ratio)}
        };
        layer.onmousemove = (e) => {
          if (!isDown) return;
          layerCtx.clearRect(0, 0, layer.width, layer.height);
          this.drawRect(layerCtx, startPoint.x, startPoint.y, Math.round(e.offsetX * this.ratio) - startPoint.x, Math.round(e.offsetY * this.ratio) - startPoint.y);
        };
        layer.onmouseup = (e) => {
          let {x, y} = startPoint;
          let width = Math.round(e.offsetX * this.ratio) - startPoint.x;
          let height = Math.round(e.offsetY * this.ratio) - startPoint.y;
          if (width < 0) {
            width = Math.abs(width);
            x = x - width
          }
          if (height < 0) {
            height = Math.abs(height);
            y = y - height;
          }
          if (width < 5 || height < 5) {
            this.$message.error('选择区域过小');
          } else {
            this.drawRect(layerCtx, x, y, width, height);
            layerCtx.clearRect(0, 0, layer.width, layer.height);
            this.drawRect(canvasCtx, x, y, width, height, true);
            this.paintHistory.push({
              x,
              y,
              width,
              height
            });
          }
          isDown = false;
          this.isDoneMosaic = true;
        };
        layer.onmouseenter = (e) => {
          if (!isDown) return;
          isLeave = false;
        };
        layer.onmouseleave = (e) => {
          if (!isDown) return;
          isLeave = true;
          leavePoint = {x: Math.round(e.offsetX * this.ratio), y: Math.round(e.offsetY * this.ratio)}
        };
        document.onmouseup = (e) => {
          if (!isDown) return;
          if (isLeave) {
            this.drawRect(layerCtx, startPoint.x, startPoint.y, leavePoint.x - startPoint.x, leavePoint.y - startPoint.y);
            layerCtx.clearRect(0, 0, layer.width, layer.height);
            this.drawRect(canvasCtx, startPoint.x, startPoint.y, leavePoint.x - startPoint.x, leavePoint.y - startPoint.y, true);
            this.paintHistory.push({
              x: startPoint.x,
              y: startPoint.y,
              width: leavePoint.x - startPoint.x,
              height: leavePoint.y - startPoint.y
            });
            isDown = false;
            this.isDoneMosaic = true;
          }
        }
      },
      unbindEvent(layer) {
        layer.onmousedown = null;
        layer.onmousemove = null;
        layer.onmouseup = null;
        layer.onmouseenter = null;
        layer.onmouseleave = null;
        document.onmouseup = null;
      },
      /**
       * 载入图片
       * @param url 图片地址
       * @param callback 载入完成后回调(可不传)
       */
      loadImage(url, callback = null) {
        const context = this.$refs.canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          this.isLoadingImage = false;
          const canvasWidth = img.width;
          const canvasHeight = img.height / img.width * canvasWidth;
          this.ratio = canvasWidth / Math.min(img.width, 960);
          this.$refs.canvas.width = canvasWidth;
          this.$refs.canvas.height = canvasHeight;
          this.$refs.layer.width = canvasWidth;
          this.$refs.layer.height = canvasHeight;
          context.drawImage(img, 0, 0, canvasWidth, canvasHeight);
          if (callback !== null) {
            callback()
          }
        };
        img.onerror = () => {
          this.isLoadingImage = false;
          this.$refs.canvasContainer.classList.add('no-pic');
        };
        img.src = url;
      },
      /**
       * 清除canvas
       * @param canvas
       */
      clearCanvas(canvas) {
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height)
      },
      /**
       * 重置canvas
       * @param canvas
       */
      resetCanvas(canvas) {
        canvas.width = 960;
        canvas.height = 500;
        this.clearCanvas(canvas);
      },
      /**
       * 绘制矩形（线框/填充马赛克）
       * @param context canvas的context
       * @param x 起始点x坐标
       * @param y 起始点y坐标
       * @param width 矩形宽度
       * @param height 矩形高度
       * @param fill 是否填充马赛克/线框
       */
      drawRect(context, x, y, width, height, fill) {
        if (fill) {
          const imageData = context.getImageData(x, y, width, height);
          const data = imageData.data;
          this.doMosaic(data, width, height);
          context.putImageData(imageData, x, y);
        } else {
          context.strokeRect(x, y, width, height)
        }
      },
      doMosaic(data, width, height) {
        for (let i = 0; i < data.length; i += 4) {
          const pIndex = i / 4;
          const pX = pIndex % width;
          const pY = Math.floor(pIndex / width);
          const tileX = pX % this.mosaicSize;
          const tileY = pY % this.mosaicSize;
          if (tileX === 0 && tileY === 0) {
            const tileWidth = Math.min(this.mosaicSize, width - pX);
            const tileHeight = Math.min(this.mosaicSize, height - pY);
            const pointNum = tileWidth * tileHeight;
            // 以这个颜色为准
            let sumR = 0;
            let sumG = 0;
            let sumB = 0;
            for (let y = 0; y < tileHeight; y++) {
              for (let x = 0; x < tileWidth; x++) {
                const index = (pY + y) * width + pX + x;
                sumR += data[index * 4];
                sumG += data[index * 4 + 1];
                sumB += data[index * 4 + 2];
              }
            }
            data[i] = sumR / pointNum;
            data[i + 1] = sumG / pointNum;
            data[i + 2] = sumB / pointNum;
          } else {
            const mX = pX - tileX;
            const mY = pY - tileY;
            const mIndex = mY * width + mX;
            data[i] = data[mIndex * 4];
            data[i + 1] = data[mIndex * 4 + 1];
            data[i + 2] = data[mIndex * 4 + 2];
            // data[i + 3] = data[mIndex * 4 + 3];
          }
        }
      },
      formatTooltip(val) {
        return `${val}px`
      },
      getData(id) {
        getPicDetail(id).then(({data}) => {
          if (data.code === 200) {
            this.detail = [];
            this.detail.push(data.body.loanApplication);
            this.picList = data.body.originals.map(origin => ({
              origin,
              mosaic: data.body.mosaics.find(_ => _.originalId === origin.proofMaterial)
            }))
          }
        })
      }
    }
  };
</script>
<style lang="scss">
  .audit-pic {
    .wrapper {
      position: relative;
      height: 420px;
      overflow-x: scroll;
      overflow-y: hidden;

      h4 {
        position: absolute;
        left: 0;
      }
      h4:nth-child(1) {
        top: 0;
      }
      h4:nth-child(2) {
        top: 205px;
      }
    }
    .list {
      left: 0;
      margin: 0;
      padding: 0;
      width: max-content;
      list-style: none;

      li {
        margin-right: 10px;
        margin-bottom: 10px;
        width: 150px;
        height: 410px;
        float: left;
      }

      .pic-item {
        position: relative;
        margin-top: 55px;
        box-sizing: border-box;
        width: 150px;
        height: 150px;
        background: #ffffff;
        border-radius: 6px;
        border: 1px solid #c0ccda;
        overflow: hidden;

        &:nth-child(2) {
        }

        &.is-done-mosaic {
          &:before {
            content: '已处理';
            position: absolute;
            display: block;
            box-sizing: border-box;
            padding-right: 5px;
            right: 0;
            top: 0;
            width: 50px;
            font-size: 12px;
            color: #ffffff;
            text-align: right;
            background: #13ce66;
          }
        }

        img {
          width: 100%;
          height: 100%;
        }

        .actions {
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          background-color: rgba(0,0,0,.5);
          color: #fff;
          text-align: center;
          font-size: 20px;
          line-height: 36px;
          opacity: 0;
          transition: opacity .3s;

          i {
            display: none;
            margin-top: 55px;
            line-height: 1.8;
            cursor: pointer;
          }

          &:hover {
            opacity: 1;
            i {
              display: inline-block;
            }
          }
        }
      }
    }

    .el-dialog__body {
      padding-top: 10px;
    }

    .canvas-container {
      position: relative;
      margin-top: 10px;

      &.no-pic {
        &:after {
          content: '图片加载错误';
          position: absolute;
          width: 100%;
          left: 0;
          top: 0;
          line-height: 500px;
          text-align: center;
        }
      }

      canvas {
        max-width: 960px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }

      .layer {
        position: absolute;
        left: 0;
        top: 0;
        cursor: crosshair;
      }
    }
  }
</style>




