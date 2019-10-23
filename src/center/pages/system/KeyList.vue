<template>
  <div class="key-list">
    <el-row style="margin-bottom: 20px;">
      <el-button icon="fa fa-search" type="primary"
                 @click="getData"></el-button>
      <el-button icon="fa fa-plus" type="primary"
                 @click="handleCreate"></el-button>
    </el-row>
    <el-table :data="list" border>
      <el-table-column v-for="col in table"
                       :label="col.label"
                       :prop="col.prop"
                       :formatter="col.formatter"
                       :key="col.prop"
                       align="center"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip content="查看">
            <el-button icon="fa fa-eye" size="small"
                       @click="handleDetail(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip content="编辑">
            <el-button icon="fa fa-edit" size="small" type="info"
                       @click="handleEdit(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialog.visible"
               :title="dialogTitle"
               width="820px"
               @close="handleDialogClose">
      <key-config ref="form"
                  v-model="dialog.form"
                  :mode="dialog.mode"></key-config>

      <div v-if="dialog.mode !== 'VIEW'" slot="footer" align="center">
        <el-button type="primary"
                   size="small"
                   @click="handleDialogConfirm">确定</el-button>
        <el-button size="small"
                   @click="handleDialogCancel">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getOrgKeyList,
    addOrgKeyConfig,
    editOrgKeyConfig
  } from '../../api/system'
  import KeyConfig from '../../../modules/org/OrgKeyConfig'

  export default {
    components: {
      KeyConfig
    },
    data() {
      return {
        list: [],
        dialog: {
          visible: false,
          mode: '',
          form: {}
        },
        table: [
          {
            label: '机构ID',
            prop: 'partyOrgId'
          },
          {
            label: '备注（机构名）',
            prop: 'remark'
          },
          {
            label: '机构公钥',
            prop: 'publicKey',
            formatter: (row, col, val) => val ? val.slice(0, 16) + '……' + val.slice(-16) : val
          },
          {
            label: '机构私钥',
            prop: 'privateKey',
            formatter: (row, col, val) => val ? val.slice(0, 16) + '……' + val.slice(-16) : val
          },
          {
            label: 'ATS私钥',
            prop: 'atsPrivateKey',
            formatter: (row, col, val) => val ? val.slice(0, 16) + '……' + val.slice(-16) : val
          },
          {
            label: 'ATS公钥',
            prop: 'atsPublicKey',
            formatter: (row, col, val) => val ? val.slice(0, 16) + '……' + val.slice(-16) : val
          },
          {
            label: '操作人',
            prop: 'updatedBy'
          }
        ]
      }
    },
    computed: {
      dialogTitle() {
        let title = '';

        switch (this.dialog.mode) {
          case 'VIEW':
            title = '查看';
            break;
          case 'EDIT':
            title = '编辑';
            break;
          case 'CREATE':
            title = '新增';
            break;
        }

        return title;
      }
    },

    created() {
      this.getData();
    },

    methods: {
      handleCreate() {
        this.dialog.form = {};
        this.dialog.mode = 'CREATE';
        this.dialog.visible = true;
      },
      handleEdit(row) {
        this.dialog.form = this.$deepcopy(row);
        this.dialog.mode = 'EDIT';
        this.dialog.visible = true;
      },
      handleDetail(row) {
        this.dialog.form = this.$deepcopy(row);
        this.dialog.mode = 'VIEW';
        this.dialog.visible = true;
      },

      handleDialogClose() {
        this.dialog.mode = '';
        this.dialog.form = null;
      },
      handleDialogConfirm() {
        this.$refs.form.validate(valid => {
          if (valid) {
            const val = this.$deepcopy(this.dialog.form);
            this.save(val);
          }
        })
      },
      handleDialogCancel() {
        this.dialog.visible = false;
      },

      // 保存公私钥
      save(val) {
        let promise = {};
        switch (this.dialog.mode) {
          case 'EDIT':
            promise = editOrgKeyConfig(val);
            break;
          case 'CREATE':
            promise = addOrgKeyConfig(val);
            break;
        }
        promise.then(({ data }) => {
          if (data.code === 200) {
            this.$message.success('保存成功');
            this.dialog.visible = false;
            this.getData();
          } else {
            this.$message.error(data.message)
          }
        })
      },
      getData() {
        getOrgKeyList().then(({ data }) => {
          if (data.code === 200) {
            this.list = data.body;
          }
        })
      }
    }
  }
</script>
