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

    <div class="pdf-wrap">
      <h4><span>资料文件</span></h4>

      <el-row type="flex">
        <ul v-if="pdfList && pdfList.length" class="pdf-list">
          <li v-for="pdf in pdfList">
            <a :href="pdf.fileUri">
              <i class="el-icon-document"></i>
              {{ pdf.fileName }}
            </a>

            <label class="btn-wrap">
              <i v-if="pdf.status === 0" class="fa fa-cut btn-cut" @click="handlePdfCut(pdf)" title="切图"></i>
              <i v-else class="el-icon-upload-success el-icon-circle-check"></i>
            </label>
          </li>
        </ul>
        <div v-else
             class="no-pdf">
          <div class="text">无</div>
        </div>
      </el-row>
    </div>
    <div class="wrapper">
      <h4>
        <span>资料原图</span>
      </h4>
      <h4>
        <span>处理后</span>
      </h4>
      <ul v-if="picList && picList.length" class="list">
        <li v-for="(item, index) in picList" :key="index">
          <div class="pic-item" :class="{ 'is-done-mosaic': !!item.mosaic, 'is-pdf': item.origin.cutImageIdent !== 0 }">
            <img :src="item.origin.fileUri" :alt="item.origin.fileName" crossorigin="anonymous"/>
            <span class="actions">
              <i class="fa fa-rotate-left" @click="handleRotateLeft(index)" title="逆时针旋转90度"></i>
              <i class="el-icon-zoom-in" @click="handlePreview(item.origin.id, index)"></i>
              <i class="fa fa-edit" @click="handleEditPic(index)"></i>
              <i class="fa fa-rotate-right" @click="handleRotateRight(index)" title="顺时针旋转90度"></i>
            </span>
          </div>
          <div class="pic-item" v-if="item.mosaic">
            <img :src="item.mosaic.fileUri" :alt="item.mosaic.fileName"/>
            <span class="actions">
              <i class="el-icon-zoom-in" @click="handlePreview(item.mosaic.id)"></i>
              <i class="el-icon-delete" @click="handleDelete(item.mosaic)"></i>
            </span>
          </div>
        </li>
      </ul>
      <ul v-else class="list">
        <li>
          <div class="pic-item no-pic">无</div>
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
            <el-button icon="fa fa-history"
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
                     :step="10" :min="10" :max="200" :format-tooltip="formatTooltip"></el-slider>
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

    <div class="rotate-container">
      <canvas ref="rotateCanvas" width="768" height="500"></canvas>
    </div>

    <el-row class="mgt20" type="flex" justify="center">
      <el-button type="primary"
                 @click="handlePush">推送</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </el-row>
  </div>
</template>

<script>
  import hotkeys from 'hotkeys-js';
  import {
    getStoreDetail,
    getPushLoanDetail,
    getProofMaterialList,
    cutPdfToPic,
    saveMosaicPic,
    deleteMosaicPic,
    getCustomizedFieldByParty,
    batchPushLoan} from '../../../api/assetMgt'
  import {
    postQiniu,
    getPicUrls} from '../../../../api/common';
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
        pdfList: [],
        picList: [],
        currentOriginIndex: null,
        showDialog: false,
        isDoneMosaic: false,
        isLoadingImage: false,
        isSavingPic: false,
        currentCommand: null,
        paintHistory: [],
        ratio: 1,
        mosaicSize: 200,
        isCropping: false,
        cropWidth: 0,
        cropHeight: 0,
        list: [],
        table: [
          {
            label: '借款编号',
            prop: 'loanApplicationNo'
          },
          {
            label: '资产渠道',
            prop: 'assetOrgName'
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
            label: '业务类型',
            prop: 'projectType',
            formatter: (row, col, value) => this.$filter(value, this.$enum.PROJECT_TYPE, this.$enum.PROJECT_TYPE)
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
      // pdf切成图片
      handlePdfCut(pdf) {
        this.$confirm(`确定将PDF（${pdf.fileName}）切图?`, '提示', { type: 'warning'}).then(() => {
          cutPdfToPic(pdf.id).then(({ status }) => {
            if (status === 201) {
              this.$message.success('切图成功');
            } else {
              this.$message.error(data.message);
            }
            setTimeout(() => {
              this.getData(this.id);
            }, 1000)
          }).catch(() => {
            this.getData(this.id);
          })
        }).catch(() => {})
      },
      // 编辑原图
      handleEditPic(index) {
        this.currentOriginIndex = index;
        this.showDialog = true;
      },
      // 旋转（顺/逆）
      handleRotateLeft(index) {
        const currentOrigin = this.picList[index].origin;
        const currentMosaic = this.picList[index].mosaic || {};
        const canvas = this.$refs.rotateCanvas;
        const ctx = canvas.getContext('2d');
        this.loadImage(currentMosaic.fileUri || currentOrigin.fileUri, (img, canvasWidth, canvasHeight) => {
          canvas.width = canvasHeight;
          canvas.height = canvasWidth;
          ctx.save();
          ctx.translate(0, canvasWidth); // 先平移
          ctx.rotate(-90 * Math.PI / 180);
          ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
          ctx.restore();
          const url = canvas.toDataURL(currentOrigin.type);
          this.saveImageByUrl(url, currentOrigin.id, currentMosaic.id, currentOrigin.fileName, currentOrigin.fileType, () => {
            this.$message.success('逆时针旋转90度');
            this.getData(this.id);
          }, (msg) => {
            this.$message.error(msg || '七牛错误');
          })
        }, () => {
          this.$message.error('图片不存在')
        })
      },
      handleRotateRight(index) {
        const currentOrigin = this.picList[index].origin;
        const currentMosaic = this.picList[index].mosaic || {};
        const canvas = this.$refs.rotateCanvas;
        const ctx = canvas.getContext('2d');
        this.loadImage(currentMosaic.fileUri || currentOrigin.fileUri, (img, canvasWidth, canvasHeight) => {
          canvas.width = canvasHeight;
          canvas.height = canvasWidth;
          ctx.save();
          ctx.translate(canvasHeight, 0); // 先平移
          ctx.rotate(90 * Math.PI / 180);
          ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
          ctx.restore();
          const url = canvas.toDataURL(currentOrigin.type);
          this.saveImageByUrl(url, currentOrigin.id, currentMosaic.id, currentOrigin.fileName, currentOrigin.fileType, () => {
            this.$message.success('顺时针旋转90度');
            this.getData(this.id);
          }, (msg) => {
            this.$message.error(msg || '七牛错误');
          })
        }, () => {})
      },
      // 预览
      handlePreview(fileId, index = -1) {
        let picList = [];
        if (index === -1) { // 马赛克
          picList = this.picList.map(_ =>
            (_.mosaic ? {
              id: _.mosaic.id,
              url: _.mosaic.fileUri,
              name: _.mosaic.fileName
            } : null)
          ).filter(_ => _ !== null);
          index = picList.findIndex(_ => _.id === fileId);
        } else {
          picList = this.picList.map(_ => ({
            url: _.origin.fileUri,
            name: _.origin.fileName
          }))
        }
        console.log(picList);
        console.log(index);
        this.$preview(picList, index);
      },
      handleDelete(file) {
        this.$confirm('确认删除?', '提示', {
          type: 'warning'
        }).then(() => {
          deleteMosaicPic(file.id).then(({ status }) => {
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
          const currentMosaic = this.picList[this.currentOriginIndex].mosaic;
          const ctx = this.$refs.canvas.getContext('2d');
          this.loadImage((currentMosaic && currentMosaic.fileUri) || currentOrigin.fileUri, (img, canvasWidth, canvasHeight) => {
            this.isLoadingImage = false;
            this.$refs.canvas.width = canvasWidth;
            this.$refs.canvas.height = canvasHeight;
            this.$refs.layer.width = canvasWidth;
            this.$refs.layer.height = canvasHeight;
            this.ratio = canvasWidth / Math.min(MAX_WIDTH, canvasWidth);
            ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
            this.handleMosaic();
          }, () => {
            this.isLoadingImage = false;
            this.$refs.canvasContainer.classList.add('no-pic');
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
        const currentMosaic = this.picList[this.currentOriginIndex].mosaic || {};
        const url = this.$refs.canvas.toDataURL(currentOrigin.type);
        this.shrinkImage(url, currentOrigin.type, (src) => {
          // 保存图片到七牛
          this.isSavingPic = true;
          this.saveImageByUrl(src, currentOrigin.id, currentMosaic.id, currentOrigin.fileName, currentOrigin.type, () => {
            this.isSavingPic = false;
            this.$message.success('保存成功');
            this.getData(this.id);
            this.paintHistory = [];
          }, (msg) => {
            this.isSavingPic = false;
            if (msg) {
              this.$message.error(msg);
            }
          });
        })
      },
      saveImageByUrl(url, originId, oldMosaicId, fileName, fileType, cbOk, cbErr) {
        const blob = this.$dataURL2Blob(url);
        const type = blob.type.replace('image/', '');
        postQiniu({
          file: blob,
          filename: fileName,
          token: this.$store.state.qiniu
        }).then((response) => {
          const res = response.data;
          // 保存打码图片
          saveMosaicPic(this.id, originId, {
            fileUri: res.key,
            fileType: fileType || type,
            name: fileName
          }).then(({data, status}) => {
            if (status === 201) {
              cbOk && cbOk();
            } else {
              cbErr && cbErr(data.message);
            }
          }).catch(({ data }) => {
            cbErr && cbErr(data.message);
          })
        }).catch(() => {
          cbErr && cbErr();
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
       * @param canvas 加载图片canvas
       * @param cbOk 载入完成后回调(可不传)
       * @param cbErr 加载失败回调
       */
      loadImage(url, cbOk = null, cbErr = null) {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          const canvasWidth = img.width;
          const canvasHeight = img.height / img.width * canvasWidth;
          cbOk && cbOk(img, canvasWidth, canvasHeight)
        };
        img.onerror = () => {
          cbErr && cbErr()
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
        batchPushLoan([this.id], personalInfo).then(({ data }) => {
          if (data.code === 200 && data.body && data.body.successCount === 1) {
            setTimeout(() => {
              this.$message.success('推送成功');
              this.$router.go(-1);
            }, 1000);
          } else {
            this.$message.error(data.detail || data.message || '推送失败')
          }
        }).catch(() => {})
      },
      handleCancel() {
        this.$router.go(-1);
      },
      getData(id) {
        getStoreDetail(id).then(({ data }) => {
          if (data.code === 200) {
            const loan = data.body;
            this.detail = [];
            this.detail.push(loan);

            getPushLoanDetail(id).then((response) => {
              const res = response.data;
              if (res.code === 200) {
                this.list = [];
                if (res.body) {
                  if (JSON.parse(res.body) instanceof Array) {
                    this.list = JSON.parse(res.body);
                  }
                }
                if (loan.loanPartyKind === this.$enum.SUBJECT_PROP_PERSON) {
                  this.getCustomizedField(id, loan.projectId, loan.loanPartyKind);
                }
              }
            })
          }
        });

        this.getMaterials(id).then(({ picList, pdfList }) => {
          const keys = [];
          picList.forEach(({ origin, mosaic }) => {
            origin && origin.fileUri && keys.push(origin.fileUri);
            mosaic && mosaic.fileUri && keys.push(mosaic.fileUri);
          });

          pdfList.forEach(pdf => {
            pdf && pdf.fileUri && keys.push(pdf.fileUri);
          });

          getPicUrls(keys).then(({ data }) => {
            if (data.code === 200) {
              picList.forEach(({ origin, mosaic }) => {
                origin && origin.fileUri && (origin.fileUri = data.body.shift());
                mosaic && mosaic.fileUri && (mosaic.fileUri = data.body.shift());
              });

              pdfList.forEach(pdf => {
                pdf && pdf.fileUri && (pdf.fileUri = this.$isUrl(pdf.fileUri) ? pdf.fileUri : (data.body.shift() + '&attname=' + encodeURIComponent(pdf.fileName)));
              });

              this.picList = picList;
              this.pdfList = pdfList;
            }
          });
        })
      },
      getMaterials(loanId) {
        return new Promise((resolve, reject) => {
          getProofMaterialList(loanId).then(({ data }) => {
            const materials = data.body && data.body.loanMaterials;
            if (data.code === 200 && materials) {
              let originals = [];
              originals = originals.concat(materials[this.$enum.PROOF_MATERIAL_P_ID_CARD] || []);
              originals = originals.concat(materials[this.$enum.PROOF_MATERIAL_O_LICENSE] || []);
              originals = originals.concat(materials[this.$enum.PROOF_MATERIAL_O_OTHER] || []);
              originals = originals.concat(materials[this.$enum.CUSTOMER_PROP_CAR] || []);
              originals = originals.concat(materials[this.$enum.CUSTOMER_PROP_SHOP] || []);
              originals = originals.concat(materials[this.$enum.CUSTOMER_PROP_ESHOP] || []);
              originals = originals.concat(materials[this.$enum.PROOF_MATERIAL_P_LOAN_APP] || []);
              const mosaic = materials[this.$enum.PROOF_MATERIAL_P_LOAN_APP_MOSAIC] || [];
              const picList = originals.map(origin => ({
                origin,
                mosaic: mosaic.find(_ => _.id === origin.mosaicId)
              }));
              const pdfList = materials[this.$enum.PROOF_MATERIAL_P_LOAN_APP_PDF] || [];
              resolve({ pdfList, picList })
            } else {
              reject();
            }
          }).catch((e) => {
            reject(e);
          });
        })
      },
      getCustomizedField(loanId, projectName, loanPartyKind) {
        getCustomizedFieldByParty(loanId, projectName, loanPartyKind).then(({ data }) => {
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
    .pdf-item {
      display: inline;
    }
    .pdf-list {
      margin: 0 0 0 10px;
      padding: 0;
      list-style: none;

      li {
        position: relative;
        box-sizing: border-box;
        padding: 0 30px;
        width: 100%;
        font-size: 14px;
        line-height: 40px;
        color: #606266;
        border-radius: 4px;
        transition: all .5s cubic-bezier(.55,0,.1,1);

        a {
          overflow: hidden;
          display: block;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-right: 150px;
          padding-left: 4px;
          color: #606266;
          transition: color .3s;

          &:hover {
            color: #0068FF;
          }
        }

        .btn-wrap {
          position: absolute;
          right: 30px;
          top: 0;
          font-size: 20px;
          line-height: 40px;

          .btn-cut {
            cursor: pointer;
            display: inline-block;

            &:hover {
              color: #0068FF;
            }

            &.is-disabled {
              cursor: not-allowed;
              color: #c0c4cc;
            }
          }

          .el-icon-upload-success {
            color: #67c23a;
          }
        }

        &:hover {
          background-color: #f5f7fa;
        }
      }
    }
    .no-pdf {
      text-align: center;
      border: 1px dashed #c0ccda;
      width: 148px;
      height: 40px;
      line-height: 40px;
      color: #8c939d;
    }

    .wrapper {
      position: relative;
      height: 420px;
      margin-top: 20px;
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
            height: 16px;
            font-size: 12px;
            color: #ffffff;
            text-align: right;
            background: #13ce66;
          }
        }

        &.is-pdf {
          &:after {
            content: 'PDF';
            position: absolute;
            display: block;box-sizing: border-box;
            padding-left: 5px;
            left: 0;
            top: 0;
            width: 36px;
            height: 16px;
            font-size: 12px;
            color: #ffffff;
            background: #e6a23c;
          }
        }

        &.no-pic {
          text-align: center;
          border: 1px dashed #c0ccda;
          width: 148px;
          height: 148px;
          line-height: 148px;
          color: #8c939d;
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
          z-index: 1;
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

    .rotate-container {
      display: none;
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
