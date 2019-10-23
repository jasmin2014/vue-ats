<template>
  <div class="protection-config-list">
    <el-form :model="search" class="form-label flex fixed-width">
      <el-row>
        <el-col :span="7">
          <el-form-item label="保障方式">
            <ats-select v-model="search.protectionModel"
                        placeholder="全部"
                        :kind="$enum.PROTECTION_MODEL"
                        :group="$enum.PROTECTION_MODEL"
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="fa fa-search" title="查找"
                     @click="handleSearch"></el-button>
          <el-button v-action="'ConfigProtectionCreate'"
                     type="primary" icon="fa fa-plus" title="添加"
                     @click="handleCreate"></el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="list" border>
      <el-table-column v-for="(col, index) in table"
                       :label="col.label"
                       :prop="col.prop"
                       :formatter="col.formatter"
                       :width="col.width"
                       :key="index"
                       align="center"></el-table-column>
      <el-table-column label="相关协议" align="center">
        <template slot-scope="scope">
          <a v-if="scope.row.fileUri"
             :href="scope.row.fileUri" target="_blank">查看附件</a>
          <span v-else>无</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-tooltip v-action="'ConfigProtectionDetail'"
                      content="查看">
            <el-button size="small" icon="fa fa-eye"
                       @click="handleDetail(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip v-action="'ConfigProtectionEdit'"
                      v-if="canEdit(scope.row)"
                      content="修改">
            <el-button size="small" icon="fa fa-edit" type="info"
                       @click="handleEdit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip v-action="'ConfigProtectionDelete'"
                      v-if="canDelete(scope.row)"
                      content="删除">
            <el-button size="small" icon="fa fa-trash" type="danger"
                       @click="handleDelete(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {
    getProtectionConfigList,
    deleteProtectionConfig
  } from '../../../api/asset';
  import {getPicUrls} from '../../../../api/common';

  export default {
    data() {
      return {
        search: {
          protectionModel: ''
        },
        list: [],
        table: [
          {
            label: '保障编号',
            prop: 'planId'
          },
          {
            label: '方案名称',
            prop: 'protectionName'
          },
          {
            label: '保障方式',
            prop: 'protectionModel',
            formatter: (row, col, val) => this.$filter(val, this.$enum.PROTECTION_MODEL, this.$enum.PROTECTION_MODEL)
          },
          {
            label: '保障平台',
            prop: 'protectionOrgName'
          },
          {
            label: '涉及银行卡',
            prop: 'bankAccount'
          }
        ]
      }
    },

    created() {
      this.getData();
    },

    methods: {
      handleSearch() {
        this.getData();
      },
      handleCreate() {
        this.$router.push({
          name: 'ConfigProtectionCreate'
        })
      },

      handleDetail(row) {
        this.$router.push({
          name: 'ConfigProtectionDetail',
          params: {
            id: row.planId
          }
        })
      },
      handleEdit(row) {
        this.$router.push({
          name: 'ConfigProtectionEdit',
          params: {
            id: row.planId
          }
        })
      },
      handleDelete(row) {
        this.$confirm('确定删除?', '提示', {
          type: 'warning'
        }).then(() => {
          this.delete(row.planId);
        });
      },
      canDelete(row) {
        return true;
      },
      canEdit(row) {
        return true;
      },

      getData() {
        getProtectionConfigList().then(({ data }) => {
          if (data.code === 200) {
            data.body = data.body || [];
            if (this.search.protectionModel) {
              this.list = data.body.filter(_ => _.protectionModel === this.search.protectionModel);
            } else {
              this.list = data.body;
            }

            const keys = this.list.map(_ => _.fileUrl);
            this.getFiles(keys)
          } else {
            this.$message.error(data.message);
            this.list = [];
          }
        }).catch(() => {
          this.list = [];
        })
      },
      delete(id) {
        deleteProtectionConfig(id).then(({ data }) => {
          if (data.code === 204) {
            setTimeout(() => {
              this.$message.success('删除成功');
              this.getData();
            })
          } else {
            this.$message.error(data.message);
            this.getData()
          }
        }).catch(() => {
          this.getData()
        })
      },
      getFiles(keys) {
        getPicUrls(keys).then(({ data }) => {
          if (data.code === 200) {
            this.list.forEach((item, i) => {
              if (item.fileUrl) {
                this.$set(item, 'fileUri', data.body[i])
              }
            })
          }
        })
      }
    }
  }
</script>
