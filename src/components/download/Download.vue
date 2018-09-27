<template>
  <el-dropdown class="download"
               trigger="click"
               placement="bottom"
               :hide-on-click="false"
               @visible-change="handleVisibleChange">
    <i class="el-icon el-icon-download"
       @click="hasUnread = false">
      <transition name="el-fade-in">
        <i class="red-dot" v-show="hasUnread"></i>
      </transition>
    </i>
    <el-dropdown-menu class="download-dropdown-list"
                      slot="dropdown">
      <div ref="menu">
        <ul v-if="list && list.length > 0" ref="list">
          <li v-for="(file, index) in list" :key="index">
            <div :class="'status-' + file.status">
              <div class="info">
              <span class="name"
                    :title="file.fileName">
                <!--成功-->
                <span v-if="file.status === 2"
                      @click="handleDownload(file.id, file.fileName)">{{ file.fileName }}</span>
                <!--等待、进行中、失败-->
                <span v-else>{{ file.fileName }}</span>
              </span>
                <span>-</span>
                <span class="status">
                <!--进行中-->
                <span v-if="file.status === 1">{{ $floatToPercentage(file.percentage) }}</span>
                  <!--等待、成功、失败-->
                <span v-else>{{ statusFilter(file.status) }}</span>
              </span>
                <span v-if="file.remark" class="remark">[{{ file.remark }}]</span>
              </div>
              <div class="creator">
                生成于 <span class="time">{{ file.createdTime}}</span>
              </div>
              <div class="progress">
                <div class="percentage"></div>
              </div>
            </div>
            <div class="del-file">
              <div title="删除" @click="handleDel(file.id)">✕</div>
            </div>
          </li>
        </ul>
        <p v-else
           class="none">暂无文件</p>
      </div>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
  import { getFileList, getFileStatus, getFileProgress, downloadFile, delFile } from '../../api/common';
  const FILE_STATUS = {
    0: '等待生成……',
    1: '进行中',
    2: '成功',
    3: '失败'
  };

  export default {
    data() {
      return {
        search: {
          pageNumber: 1,
          pageSize: 10
        },
        hasUnread: false,
        hasBindedScrollEvent: false
      }
    },
    computed: {
      list: {
        get() {
          return this.$store.state.download.list
        }
      },
      waitingList: {
        get() {
          return this.$store.getters.downloadWaitingList
        }
      },
      processingList: {
        get() {
          return this.$store.getters.downloadProcessingList
        }
      }
    },
    created() {
      this.getFiles(1);
      setInterval(() => {
        this.updateFileStatus();
      }, 10000);
      setInterval(() => {
        this.updateFileProgress();
      }, 1000);
    },
    methods: {
      handleDownload(fileId, fileName) {
        downloadFile(fileId, fileName).then(({ data, status }) => {
          if (status === 200) {
            const url = this.$createObjectURL(data);
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = fileName;
            anchor.click();
            this.$revokeObjectURL(url)
          }
        }).catch(() => {
        })
      },
      handleVisibleChange(visible) {
        if (visible) {
          if (!this.hasBindedScrollEvent &&
            this.list && this.list.length) {
            this.hasBindedScrollEvent = true;
            this.$refs.menu.addEventListener('scroll', this.handleScroll)
          } else if (this.hasBindedScrollEvent && (!this.list || !this.list.length)) {
            this.hasBindedScrollEvent = false;
          }
        }
      },
      handleScroll() {
        window.requestAnimationFrame(() => {
          const diff = this.$refs.list.clientHeight - this.$refs.menu.clientHeight - this.$refs.menu.scrollTop;
          if (!this.$store.state.download.loadDone &&
            !this.$store.state.download.loading &&
            diff <= 100) {
            this.$store.commit('updateDownloadLoadStatus', true);
            this.getFiles(this.$store.state.download.index + 1)
          }
        })
      },
      getFiles(index) {
        this.search.pageNumber = index;
        const search = this.$deepcopy(this.search);
        getFileList(search).then(({ data }) => {
          if (data.code === 200 && data.body) {
            data.body.pageSize = this.search.pageSize;
            this.$store.commit('updateDownloads', data.body);
            this.$store.commit('updateDownloadLoadStatus', false);
          }
        })
      },
      updateFileStatus() {
        if (this.waitingList.length > 0) {
          const ids = this.waitingList.map(_ => _.id);
          getFileStatus(ids).then(({ data }) => {
            if (data.code === 200 && data.body.length === ids.length) {
              this.waitingList.forEach((_, index) => {
                _.status = data.body[index].status;
                _.remark = data.body[index].remark;
                if (_.status === 2 || _.status === 3) {
                  this.hasUnread = true;
                }
              })
            }
          }).catch(() => {
          })
        }
      },
      updateFileProgress() {
        if (this.processingList.length > 0) {
          const ids = this.processingList.map(_ => _.id);
          for (let i = 0; i < ids.length; i++) {
            getFileProgress(ids[i]).then(({ data }) => {
              if (data.code === 200) {
                if (data.body[ids[i]] === null) {
                  this.$set(this.processingList[i], 'status', 0);
                  this.updateFileStatus();
                } else {
                  this.$set(this.processingList[i], 'percentage', Number(data.body[ids[i]].toFixed(4)));
                }
              }
            })
          }
        }
      },
      handleDel(id) {
        delFile(id).then(response => {
          if (response.status === 204) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.$store.commit('deleteDownloadFile', id);
          }
        }, () => {})
      },
      statusFilter(status) {
        return FILE_STATUS[status] || status
      }
    }
  }
</script>

<style lang="scss">
  .download {
    position: relative;
    color: #333333;

    & > i {
      position: relative;
      cursor: pointer;
      text-align: center;
      width: 100%;
      font-size: 28px;

      .red-dot {
        position: absolute;
        top: 12px;
        right: 16px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #ff414c;
      }
    }
  }

  .download-dropdown-list {
    margin: 12px 0 0;
    padding: 0;
    width: 300px;
    background: #ffffff;

    .none {
      text-align: center;
      font-size: 14px;
      color: #868d9a;
    }

    & > div {
      overflow-y: auto;
      max-height: 300px;
    }

    ul {
      list-style: none;
      margin: 0;
      padding: 0 15px;
      font-size: 12px;
      color: #868d9a;

      li {
        padding: 15px 25px 15px 0;
        border-bottom: 1px solid #e3e7ee;
        position: relative;

        &:last-child {
          border: none;
        }
        &:hover{
          .del-file{
            display: block;
          }
        }

        .info {
          & > span {
            vertical-align: middle;
          }
        }

        .name {
          display: inline-block;
          max-width: 190px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 14px;
          color: #333333;
        }

        .status {
          display: inline-block;
          max-width: 60px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .status-0 {
          .name {
            max-width: 160px;
          }
        }

        .status-1 {
          .name {
            max-width: 180px;
          }
        }

        .status-2 {
          .status {
            color: #67c23a;
          }

          .name {
            cursor: pointer;
            &:hover {
              text-decoration: underline;
            }
          }
        }

        .status-3 {
          .status {
            color: #f56c6c;
          }
        }

        .remark {
          color: #868d9a;
        }

        .del-file{
          display: none;
          position: absolute;
          right: 5px;
          top:50%;
          transform: translateY(-50%);
          color: #444;
          cursor: pointer;
          font-size: 16px;
        }
      }
    }
  }
</style>
