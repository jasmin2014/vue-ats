<template>
  <div class="push">
    <el-row class="mgt20">
      <el-table :data="detail" border>
        <el-table-column v-for="col in table"
                         align="center"
                         :key="col.prop"
                         :label="col.label"
                         :prop="col.prop"
                         :formatter="col.formatter"></el-table-column>
      </el-table>
    </el-row>

    <el-table :data="list" border class="mgt20">
      <el-table-column label="验证内容" prop="code" align="center"></el-table-column>
      <el-table-column label="内容/结果" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isContent">
            {{ scope.row.value }}
          </span>
          <el-select v-else
                     v-model="scope.row.value">
            <el-option value="未验证"></el-option>
            <el-option value="已验证"></el-option>
          </el-select>
        </template>
      </el-table-column>
    </el-table>

    <div class="wrapper">
      <h4>
        <span>资料原图</span>
      </h4>
      <h4>
        <span>处理后</span>
      </h4>
      <ul class="list">
        <li v-for="(item, index) in picList" :key="index">
          <div class="pic-item" :class="!item.mosaic ? '' : 'is-done-mosaic'">
            <img :src="item.origin.uri" :alt="item.origin.name" crossorigin="anonymous"/>
            <span class="actions">
              <i class="fa fa-edit" @click="handleEditPic(index)"></i>
            </span>
          </div>
          <div class="pic-item" v-if="item.mosaic">
            <img :src="item.mosaic.uri" :alt="item.mosaic.name"/>
            <span class="actions">
              <i class="el-icon-zoom-in" @click="handlePreview(index)"></i>
              <i class="el-icon-delete" @click="handleDelete(item.mosaic)"></i>
            </span>
          </div>
        </li>
      </ul>
    </div>

    <!--:show-close="false"-->
    <el-dialog title="图片处理" :visible.sync="showDialog" width="808px"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               :before-close="handleBeforeDialogClose"
               @open="handleDialogOpen"
               @close="handleDialogClose">
      <el-tag class="tag-status" v-show="hasCurrentMosaic"
              type="success" size="small">已处理</el-tag>
      <button class="btn-prev" title="上一张"
              v-show="showPrev"
              @click="handleImageAt(currentOriginIndex - 1)">
        <i class="el-icon el-icon-arrow-left"></i>
      </button>
      <button class="btn-next" title="下一张"
              v-show="showNext"
              @click="handleImageAt(currentOriginIndex + 1)">
        <i class="el-icon el-icon-arrow-right"></i>
      </button>
      <el-row style="height: 70px;">
        <el-col :span="10">
          <el-tooltip content="保存">
            <el-button icon="fa fa-save"
                       size="small"
                       type="primary"
                       @click="handleSave"></el-button>
          </el-tooltip>
          <el-tooltip content="丢弃">
            <el-button icon="fa fa-times-circle"
                       size="small"
                       @click="handleDiscard"></el-button>
          </el-tooltip>
        </el-col>
        <el-col :span="5">
          <el-tooltip content="撤销 (Ctrl+Z)">
            <el-button icon="fa fa-undo"
                       size="small"
                       :disabled="paintHistory.length === 0"
                       @click="handleUndo"></el-button>
          </el-tooltip>
          <el-tooltip content="裁剪 (C)">
            <el-button icon="fa fa-crop"
                       :class="{ selected: currentCommand === 'crop' }"
                       size="small"
                       @click="handleCrop"></el-button>
          </el-tooltip>
          <el-tooltip content="模糊 (M)">
            <el-button icon="fa fa-tint"
                       :class="{ selected: currentCommand === 'mosaic' }"
                       size="small"
                       :disabled="isLoadingImage"
                       @click="handleMosaic"></el-button>
          </el-tooltip>
        </el-col>
        <el-col v-show="currentCommand === 'mosaic'"
                :span="3" style="text-align: right; line-height: 40px; padding-right: 10px;">
          模糊尺寸
        </el-col>
        <el-col v-show="currentCommand === 'mosaic'"
                :span="6">
          <el-slider v-model="mosaicSize"
                     :step="5" :min="5" :max="50" :format-tooltip="formatTooltip"></el-slider>
        </el-col>
        <el-col v-show="currentCommand === 'crop'"
                :span="4" :offset="3">
          <el-tooltip content="保存裁剪">
            <el-button icon="fa fa-check"
                       size="small"
                       @click="handleSaveCrop"></el-button>
          </el-tooltip>
          <el-tooltip content="丢弃裁剪">
            <el-button icon="fa fa-times"
                       size="small"
                       @click="handleDiscardCrop"></el-button>
          </el-tooltip>
        </el-col>
      </el-row>
      <div ref="canvasContainer" class="canvas-container" v-loading="isLoadingImage">
        <canvas ref="canvas" width="768" height="500"></canvas>
        <canvas ref="layer" class="layer" width="768" height="500"
                v-show="currentCommand === 'mosaic'"></canvas>
        <div ref="cropRect" class="clip-rect" data-pos="center"
             v-show="currentCommand === 'crop'">
          <span class="clip-tips">{{ cropImageWidth }}, {{ cropImageHeight }}</span>
          <span class="clip-rect-horn horn-nw" data-pos="nw"></span>
          <span class="clip-rect-horn horn-ne" data-pos="ne"></span>
          <span class="clip-rect-horn horn-sw" data-pos="sw"></span>
          <span class="clip-rect-horn horn-se" data-pos="se"></span>
          <span class="clip-rect-horn horn-n" data-pos="n"></span>
          <span class="clip-rect-horn horn-s" data-pos="s"></span>
          <span class="clip-rect-horn horn-w" data-pos="w"></span>
          <span class="clip-rect-horn horn-e" data-pos="e"></span>
        </div>
      </div>
      <div class="shrink-area">
        <canvas ref="shrinkCanvas"></canvas>
      </div>
    </el-dialog>

    <el-row type="flex" justify="center">
      <el-button type="primary"
                 @click="handlePush">推送</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </el-row>
  </div>
</template>

<script>
  import hotkeys from 'hotkeys-js';
  import {
    getPicDetail,
    saveMosaicPic,
    deleteMosaicPic,
    getCustomizedFieldByParty,
    pushLoanApplication} from '../../../api/assetMgt'
  import {postQiniu} from '../../../../api/common';
  const COMMAND = {
    MOSAIC: 'mosaic',
    CROP: 'crop'
  };
  const maxCropSize = {};
  const MAX_WIDTH = 768;

  export default {
    data() {
      return {
        id: this.$route.params.id,
        detail: [],
        picList: [],
        currentOriginIndex: null,
        showDialog: false,
        isDoneMosaic: false,
        isLoadingImage: false,
        isSavingPic: false,
        currentCommand: null,
        paintHistory: [],
        ratio: 1,
        mosaicSize: 20,
        isCropping: false,
        cropWidth: 0,
        cropHeight: 0,
        list: [],
        table: [
          {
            label: '借贷编号',
            prop: 'loanApplicationNo'
          },
          {
            label: '资产渠道',
            prop: 'assetChannel'
          },
          {
            label: '主体性质',
            prop: 'loanPartyKind',
            formatter: (row, col, val) => this.$filter(val, this.$enum.SUBJECT_PROP, this.$enum.SUBJECT_PROP)
          },
          {
            label: '资产类型',
            prop: 'assetKind',
            formatter: (row, col, value) => this.$filter(value, this.$enum.ASSET_TYPE, this.$enum.ASSET_TYPE)
          },
          {
            label: '项目名称',
            prop: 'loanKind',
            formatter: (row, col, value) => this.$filter(value, this.$enum.LOAN_TYPE, row.assetKind)
          },
          {
            label: '申请时间',
            prop: 'appliedTime'
          }
        ]
      };
    },
    computed: {
      cropImageWidth() {
        return Math.round(this.cropWidth * this.ratio)
      },
      cropImageHeight() {
        return Math.round(this.cropHeight * this.ratio)
      },
      showPrev() {
        return this.currentOriginIndex > 0;
      },
      showNext() {
        return this.currentOriginIndex < this.picList.length - 1;
      },
      hasCurrentMosaic() {
        if (typeof this.currentOriginIndex === 'number') {
          return !!this.picList[this.currentOriginIndex].mosaic
        }
        return false;
      }
    },
    created() {
      this.getData(this.id);
    },
    mounted() {
      hotkeys('ctrl+z', this.handleUndo);
      hotkeys('m', this.handleMosaic);
      hotkeys('c', this.handleCrop)
    },
    destroyed() {
      hotkeys.unbind('ctrl+z');
      hotkeys.unbind('m');
      hotkeys.unbind('c');
    },
    methods: {
      // 编辑原图
      handleEditPic(index) {
        this.currentOriginIndex = index;
        this.showDialog = true;
      },
      // 预览
      handlePreview(index) {
        const mosaicList = this.picList.map(_ =>
          (_.mosaic ? {
            url: _.mosaic.uri,
            name: _.mosaic.name
          } : null)
        ).filter(_ => _ !== null);
        this.$preview(mosaicList, index);
      },
      handleDelete(file) {
        this.$confirm('确认删除?', '提示', {
          type: 'warning'
        }).then(() => {
          deleteMosaicPic(file.proofMaterial).then(({ status }) => {
            if (status === 204) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
            } else {
              this.$message.error(data.detail || data.message);
            }
            this.getData(this.id);
          }).catch(() => {
            this.getData(this.id);
          });
        });
      },
      handleDialogOpen() {
        this.$nextTick(() => {
          this.isLoadingImage = true;
          const currentOrigin = this.picList[this.currentOriginIndex].origin;
          this.loadImage(currentOrigin.uri, () => {
            // 默认打码操作
            this.handleMosaic();
            // this.handleCrop();
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
          if (this.paintHistory.length > 0) {
            this.$confirm('确认丢弃现在的操作?', '提示', {
              type: 'warning'
            }).then(() => {
              done();
            });
          } else {
            done();
          }
        }
      },
      handleDialogClose() {
        // reset
        this.isDoneMosaic = false;
        this.isLoadingImage = false;
        this.isSavingPic = false;
        this.paintHistory = [];
        this.currentCommand = null;
        this.$refs.canvasContainer.classList.remove('no-pic');
        this.resetCanvas(this.$refs.canvas);
        this.resetCanvas(this.$refs.layer);
        this.unbindMosaicEvent();
        this.unbindCropEvent();
      },
      handleSave() {
        if (this.isSavingPic) {
          this.$message({
            message: '正在保存，请稍后操作',
            type: 'warning'
          });
          return;
        }
        const currentOrigin = this.picList[this.currentOriginIndex].origin;
        const url = this.$refs.canvas.toDataURL(currentOrigin.type);
        this.shrinkImage(url, currentOrigin.type, (src) => {
          const blob = this.$dataURL2Blob(src);
          const fileType = blob.type.replace('image/', '');
          // 保存图片到七牛
          this.isSavingPic = true;
          postQiniu({
            file: blob,
            filename: currentOrigin.name,
            token: this.$store.state.qiniu
          }).then((response) => {
            const res = response.data;
            // 保存打码图片
            saveMosaicPic(this.id, currentOrigin.proofMaterial, {
              fileUri: res.key,
              fileType: currentOrigin.type || fileType,
              name: currentOrigin.name
            }).then(({data, status}) => {
              this.isSavingPic = false;
              if (status === 201) {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                });
                this.getData(this.id);
                this.paintHistory = [];
              } else {
                this.$message.error(data.message);
              }
            }, ({data}) => {
              this.isSavingPic = false;
              this.$message.error(data.message);
            });
          }, () => {
            this.isSavingPic = false;
          })
        })
      },
      handleDiscard() {
        if (this.isSavingPic) {
          this.$message({
            message: '正在保存，请稍后操作',
            type: 'warning'
          });
        } else {
          if (this.paintHistory.length > 0) {
            this.$confirm('确认丢弃现在的操作?', '提示', {
              type: 'warning'
            }).then(() => {
              this.showDialog = false;
            });
          } else {
            this.showDialog = false;
          }
        }
      },
      handleImageAt(index) {
        if (index < 0 || index > this.picList.length - 1) return;
        if (this.isSavingPic) { // 保存中
          this.$message({
            message: '正在保存，请稍后操作',
            type: 'warning'
          });
          return;
        }

        if (this.paintHistory.length > 0) { // 有未保存操作
          this.$confirm('确认丢弃现在的操作?', '提示', {
            type: 'warning'
          }).then(() => {
            this.handleOriginImageAt(index);
          });
          return;
        }

        this.handleOriginImageAt(index);
      },
      handleOriginImageAt(index) {
        this.currentOriginIndex = index;
        this.showDialog = false;
        this.$nextTick(() => {
          this.showDialog = true;
        });
      },
      // 撤销
      handleUndo() {
        if (this.paintHistory.length === 0) return;

        const history = this.paintHistory.pop();
        if (this.paintHistory.length === 0) {
          this.isDoneMosaic = false;
        }
        this.undoCommand(history.command, history)
      },
      handleCrop() {
        this.currentCommand = COMMAND.CROP;

        maxCropSize.width = this.$refs.canvas.width / this.ratio;
        maxCropSize.height = this.$refs.canvas.height / this.ratio;
        this.cropWidth = maxCropSize.width;
        this.cropHeight = maxCropSize.height;
        this.$refs['cropRect'].style.width = this.$refs.canvas.width / this.ratio + 'px';
        this.$refs['cropRect'].style.height = this.$refs.canvas.height / this.ratio + 'px';
        this.$refs['cropRect'].style.left = '0px';
        this.$refs['cropRect'].style.top = '0px';
        this.bindCropEvent();
      },
      bindCropEvent() {
        if (this.$refs.cropRect.onmousedown) return;
        let downPos = null;
        let startPoint = {};
        let originalSize = {};
        let originalOffset = {};

        this.$refs.cropRect.onmousedown = (e) => {
          downPos = e.target.dataset.pos;
          if (!downPos) return;
          startPoint = {x: e.pageX, y: e.pageY};
          originalSize = {
            width: this.$refs.cropRect.offsetWidth,
            height: this.$refs.cropRect.offsetHeight
          };
          this.cropWidth = originalSize.width;
          this.cropHeight = originalSize.height;
          originalOffset = {
            top: parseInt(this.$refs.cropRect.style.top || '0'),
            left: parseInt(this.$refs.cropRect.style.left || '0')
          };
        };
        document.onmousemove = (e) => {
          if (!downPos) return;
          const offsetX = e.pageX - startPoint.x;
          const offsetY = e.pageY - startPoint.y;

          if (downPos === 'e' || downPos === 'ne' || downPos === 'se') {
            let width = originalSize.width + offsetX;
            width = width <= 0 ? 0 : width >= maxCropSize.width ? maxCropSize.width : width;
            this.$refs.cropRect.style.width = width + 'px';
            this.cropWidth = width;
          }

          if (downPos === 's' || downPos === 'sw' || downPos === 'se') {
            let height = originalSize.height + offsetY;
            height = height <= 0 ? 0 : height >= maxCropSize.height ? maxCropSize.height : height;
            this.$refs.cropRect.style.height = height + 'px';
            this.cropHeight = height;
          }

          if (downPos === 'n' || downPos === 'nw' || downPos === 'ne') {
            let height = originalSize.height - offsetY;
            height = height <= 0 ? 0 : height >= maxCropSize.height ? maxCropSize.height : height;
            const actualOffsetY = originalSize.height - height;
            this.$refs.cropRect.style.height = height + 'px';
            this.$refs.cropRect.style.top = (originalOffset.top + actualOffsetY) + 'px';
            this.cropHeight = height;
          }

          if (downPos === 'w' || downPos === 'nw' || downPos === 'sw') {
            let width = originalSize.width - offsetX;
            width = width <= 0 ? 0 : width >= maxCropSize.width ? maxCropSize.width : width;
            const actualOffsetX = originalSize.width - width;
            this.$refs.cropRect.style.width = width + 'px';
            this.$refs.cropRect.style.left = (originalOffset.left + actualOffsetX) + 'px';
            this.cropWidth = width;
          }

          if (downPos === 'center') {
            let top = originalOffset.top + offsetY;
            let left = originalOffset.left + offsetX;

            top = top <= 0 ? 0 : top + originalSize.height >= maxCropSize.height ? maxCropSize.height - originalSize.height : top;
            left = left <= 0 ? 0 : left + originalSize.width >= maxCropSize.width ? maxCropSize.width - originalSize.width : left;

            this.$refs.cropRect.style.top = top + 'px';
            this.$refs.cropRect.style.left = left + 'px';
          }
        };
        document.onmouseup = (e) => {
          if (!downPos) return;
          downPos = null;
        };
      },
      unbindCropEvent() {
        this.$refs.cropRect.onmousedown = null;
        document.onmousemove = null;
        document.onmouseup = null;
      },
      handleSaveCrop() {
        // computed size in canvas, ratio considered
        const x = this.$refs.cropRect.offsetLeft * this.ratio;
        const y = this.$refs.cropRect.offsetTop * this.ratio;
        const width = this.$refs.cropRect.offsetWidth * this.ratio;
        const height = this.$refs.cropRect.offsetHeight * this.ratio;

        this.command(COMMAND.CROP, {x, y, width, height });
        this.handleCrop();
      },
      handleDiscardCrop() {
        this.handleCrop();
      },
      handleMosaic() {
        this.currentCommand = COMMAND.MOSAIC;
        this.$refs.layer.width = this.$refs.canvas.width;
        this.$refs.layer.height = this.$refs.canvas.height;
        this.bindMosaicEvent();
      },
      bindMosaicEvent() {
        const layer = this.$refs.layer;
        const layerCtx = layer.getContext('2d');
        if (layer.onmousedown) return;

        let isDown = false;
        let isLeave = false;
        let startPoint = {};
        let leavePoint = {};

        layer.onmousedown = (e) => {
          isDown = true;
          layerCtx.strokeStyle = '#d606ff';
          layerCtx.lineWidth = 2 * this.ratio;
          startPoint = {x: Math.round(e.offsetX * this.ratio), y: Math.round(e.offsetY * this.ratio)}
        };
        layer.onmousemove = (e) => {
          if (!isDown) return;
          layerCtx.clearRect(0, 0, layer.width, layer.height);
          layerCtx.strokeRect(startPoint.x, startPoint.y, Math.round(e.offsetX * this.ratio) - startPoint.x, Math.round(e.offsetY * this.ratio) - startPoint.y);
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
            // this.$message.error('选择区域过小');
          } else {
            layerCtx.strokeRect(x, y, width, height);
            layerCtx.clearRect(0, 0, layer.width, layer.height);
            this.command(COMMAND.MOSAIC, {
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
            layerCtx.strokeRect(startPoint.x, startPoint.y, leavePoint.x - startPoint.x, leavePoint.y - startPoint.y);
            layerCtx.clearRect(0, 0, layer.width, layer.height);
            this.command(COMMAND.MOSAIC, {
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
      unbindMosaicEvent() {
        const layer = this.$refs.layer;

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
          this.ratio = canvasWidth / Math.min(MAX_WIDTH, img.width);
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
      shrinkImage(url, originType, callback) {
        const img = new Image();
        const canvas = this.$refs.shrinkCanvas;
        img.onload = () => {
          if (img.width > MAX_WIDTH) {
            const ctx = canvas.getContext('2d');
            canvas.width = MAX_WIDTH;
            canvas.height = MAX_WIDTH * img.height / img.width;
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
            url = canvas.toDataURL(originType);
          }
          callback(url);
        };
        img.src = url;
      },
      command(type, options) {
        const context = this.$refs.canvas.getContext('2d');
        let imageData;
        switch (type) {
          case COMMAND.MOSAIC:
            imageData = context.getImageData(options.x, options.y, options.width, options.height);
            this.paintHistory.push({
              command: type,
              data: imageData,
              x: options.x,
              y: options.y
            });
            this.doMosaic(options.x, options.y, options.width, options.height);
            break;
          case COMMAND.CROP:
            imageData = context.getImageData(0, 0, this.$refs.canvas.width, this.$refs.canvas.height);
            this.paintHistory.push({
              command: type,
              data: imageData,
              ratio: this.ratio,
              width: this.$refs.canvas.width,
              height: this.$refs.canvas.height
            });
            this.doCrop(options.x, options.y, options.width, options.height);
            break;
          default:
            break;
        }
      },
      undoCommand(type, options) {
        console.log(options);
        const context = this.$refs.canvas.getContext('2d');
        switch (type) {
          case COMMAND.MOSAIC:
            context.putImageData(options.data, options.x, options.y);
            break;
          case COMMAND.CROP:
            this.$refs.canvas.width = options.width;
            this.$refs.canvas.height = options.height;
            this.$refs.layer.width = options.width;
            this.$refs.layer.height = options.height;
            this.ratio = options.ratio;
            this.clearCanvas(this.$refs.canvas);
            context.putImageData(options.data, 0, 0);
            if (this.currentCommand === 'crop') {
              this.handleCrop();
            }
            break;
          default:
            break;
        }
      },
      doCrop(x, y, width, height) {
        const canvas = this.$refs.canvas;
        const context = canvas.getContext('2d');
        const imageData = context.getImageData(x, y, width, height);
        canvas.width = width;
        canvas.height = height;
        this.ratio = canvas.width / Math.min(MAX_WIDTH, width);
        context.putImageData(imageData, 0, 0);
      },
      /**
       * 马赛克
       * @param x 起始点x坐标
       * @param y 起始点y坐标
       * @param width 矩形宽度
       * @param height 矩形高度
       */
      doMosaic(x, y, width, height) {
        const context = this.$refs.canvas.getContext('2d');
        const imageData = context.getImageData(x, y, width, height);
        const data = imageData.data;
        this.computeMosaic(data, width, height);
        context.putImageData(imageData, x, y);
      },
      computeMosaic(data, width, height) {
        for (let i = 0; i < data.length; i += 4) {
          const pIndex = i / 4; // 每四个代表一个完整的RGBA
          const pX = pIndex % width;
          const pY = Math.floor(pIndex / width);
          const tileX = pX % this.mosaicSize;
          const tileY = pY % this.mosaicSize;
          if (tileX === 0 && tileY === 0) { // 一个格子的原点（遍历遇到的第一个点）
            const tileWidth = Math.min(this.mosaicSize, width - pX); // 处理边缘格子的长宽，可能小于mosaicSize
            const tileHeight = Math.min(this.mosaicSize, height - pY);
            const pointNum = tileWidth * tileHeight;
            // 算出平均色，并将原点赋值为平均色，同方格的其他点将取这个点的颜色
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
            const mIndex = mY * width + mX; // 本格中原点的index
            data[i] = data[mIndex * 4];
            data[i + 1] = data[mIndex * 4 + 1];
            data[i + 2] = data[mIndex * 4 + 2];
            // data[i + 3] = data[mIndex * 4 + 3]; // 透明度A不变
          }
        }
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
        canvas.width = 768;
        canvas.height = 500;
        this.clearCanvas(canvas);
      },
      formatTooltip(val) {
        return `${val}px`
      },

      handlePush() {
        const list = this.list.filter(_ => !_.isContent);
        const personalInfo = list.length ? JSON.stringify(list) : null;
        pushLoanApplication(this.id, personalInfo).then(({ data }) => {
          if (data.code === 200) {
            this.$message({
              message: '推送成功',
              type: 'success'
            });
            this.$router.go(-1);
          } else {
            this.$message.error(data.message || data.detail)
          }
        }).catch(() => {})
      },
      handleCancel() {
        this.$router.go(-1);
      },
      getData(id) {
        getPicDetail(id).then(({data}) => {
          if (data.code === 200) {
            const loan = data.body.loanApplication;
            this.detail = [];
            this.detail.push(loan);
            this.picList = data.body.originals.map(origin => ({
              origin,
              mosaic: data.body.mosaics.find(_ => _.originalId === origin.proofMaterial)
            }));
            this.list = [];
            if (loan.channelPersonalInfo) {
              if (JSON.parse(loan.channelPersonalInfo) instanceof Array) {
                this.list = JSON.parse(loan.channelPersonalInfo);
              }
            }
            if (loan.loanPartyKind === this.$enum.SUBJECT_PROP_PERSON) {
              this.getCustomizedField(loan.loanParty, loan.loanKind);
            }
          }
        })
      },
      getCustomizedField(loanParty, projectName) {
        getCustomizedFieldByParty(loanParty, projectName).then(({ data }) => {
          if (data.code === 200 && data.body) {
            for (const code in data.body) {
              if (data.body.hasOwnProperty(code)) {
                this.list.push({
                  code,
                  value: data.body[code],
                  isContent: true
                })
              }
            }
          }
        })
      }
    }
  };
</script>
<style lang="scss">
  .push {
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

      * {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }

      .tag-status {
        position: absolute;
        top: 15px;
        left: 100px;
      }

      .btn-prev, .btn-next {
        position: fixed;
        cursor: pointer;
        top: 15%;
        width: 200px;
        height: 70%;
        font-size: 100px;
        background: none;
        color: #ffffff;
        border: none;
      }
      .btn-prev {
        text-align: right;
        right: 50%;
        margin-right: 420px;
      }
      .btn-next {
        text-align: left;
        left: 50%;
        margin-left: 420px;
      }
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
        max-width: 768px;
      }

      .layer {
        position: absolute;
        left: 0;
        top: 0;
        cursor: crosshair;
      }
    }

    .shrink-area {
      display: none;
    }

    .el-button.selected {
      color: #0068FF;
      border-color: rgb(179, 210, 255);
      background-color: rgb(230, 240, 255);
    }

    .clip-rect {
      position: absolute;
      border: 1px dashed #de3c50;
      top: 0;
      left: 0;
      width: 768px;
      height: 100px;
      cursor: move;
    }

    .clip-tips {
      position: absolute;
      top: -40px;
      left: 0;
      padding: 5px;
      font-size: 13px;
      background-color: #333;
      border-radius: 5px;
      color: #fff;
      cursor: auto;
    }

    .clip-rect-horn {
      position: absolute;
      display: block;
      background-color: rgba(222,60,80,.7);
      border-radius: 50%;
      width: 20px;
      height: 20px;

      &.horn-nw {
        top: -10px;
        left: -10px;
        cursor: nw-resize;
      }

      &.horn-ne {
        top: -10px;
        right: -10px;
        cursor: ne-resize;
      }

      &.horn-sw {
        bottom: -10px;
        left: -10px;
        cursor: sw-resize;
      }

      &.horn-se {
        bottom: -10px;
        right: -10px;
        cursor: se-resize;
      }

      &.horn-n {
        top: -10px;
        left: 50%;
        margin-left: -10px;
        cursor: n-resize;
      }

      &.horn-s {
        bottom: -10px;
        left: 50%;
        margin-left: -10px;
        cursor: s-resize;
      }

      &.horn-w {
        top: 50%;
        left: -10px;
        margin-top: -10px;
        cursor: w-resize;
      }

      &.horn-e {
        top: 50%;
        right: -10px;
        margin-top: -10px;
        cursor: e-resize;
      }
    }
  }
</style>




