<template>
  <div class="constant-list">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="6">
          <el-form-item label="类型">
            <el-input v-model.trim="search.kind"
                      clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="参数名">
            <el-input v-model.trim="search.propName"
                      clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="fa fa-search" title="查询"
                     @click="handleSearch"></el-button>
          <el-button icon="fa fa-plus" type="primary" title="增加"
                     @click="handleCreate"></el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="list" border>
      <el-table-column v-for="(col, i) in table"
                       :key="i"
                       v-bind="col"
                       align="center"></el-table-column>
      <el-table-column label="操作"
                       align="center"
                       fixed="right">
        <template slot-scope="scope">
          <el-tooltip content="编辑">
            <el-button icon="fa fa-edit"
                       size="small"
                       type="info"
                       @click="handleEdit(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination :total="pageTotal" :page-size="search.pageSize"
                     layout="total, prev, pager, next, jumper, sizes" :page-sizes="[20, 50, 100]"
                     @current-change="getData" @size-change="handlePageSizeChange"></el-pagination>
    </el-row>

    <el-dialog v-if="dialog"
               :visible.sync="dialog.visible"
               :title="dialogTitle"
               width="500px"
               @close="handleDialogClose">
      <constant ref="form"
                v-model="dialog.form"
                :mode="dialog.mode"
                style="width: 90%;"></constant>
      <div slot="footer" align="center">
        <el-button type="primary"
                   @click="handleConfirm">确 定</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Constant from '../../../modules/system/Constant'
  import {getConstantList, createConstant, editConstant} from '../../api/system';

  export default {
    components: {
      Constant
    },
    data() {
      return {
        search: {
          pageNumber: 1,
          pageSize: 20
        },
        pageTotal: 0,
        list: [],
        table: [
          {
            label: '编号',
            prop: 'id'
          },
          {
            label: '类型',
            prop: 'kind'
          },
          {
            label: '参数名',
            prop: 'propName'
          },
          {
            label: '参数值',
            prop: 'propValue'
          },
          {
            label: '备注',
            prop: 'remarks'
          },
          {
            label: '操作人',
            prop: 'updatedBy'
          },
          {
            label: '更新时间',
            prop: 'updatedTime'
          }
        ],
        dialog: {
          visible: false,
          mode: '',
          form: null
        }
      }
    },
    computed: {
      dialogTitle: {
        get() {
          let title = '';
          switch (this.dialog.mode) {
            case 'EDIT':
              title = '编辑';
              break;
            case 'CREATE':
              title = '新增';
              break;
          }
          return title;
        }
      }
    },

    created() {
      this.getData(1);
    },

    methods: {
      handleSearch() {
        this.getData(1);
      },
      handleCreate() {
        this.dialog.form = {
          propName: '',
          propValue: '',
          kind: '',
          remarks: ''
        };
        this.dialog.mode = 'CREATE';
        this.dialog.visible = true;
      },
      handleEdit(row) {
        this.dialog.form = {
          id: row.id,
          propName: row.propName,
          propValue: row.propValue,
          kind: row.kind,
          remarks: row.remarks
        };
        this.dialog.mode = 'EDIT';
        this.dialog.visible = true;
      },
      handleConfirm() {
        this.$refs.form.validate(valid => {
          if (valid) {
            const val = this.$deepcopy(this.dialog.form);
            switch (this.dialog.mode) {
              case 'EDIT':
                this.edit(val);
                break;
              case 'CREATE':
                this.create(val);
                break;
            }
          }
        })
      },
      handleCancel() {
        this.dialog.visible = false;
      },
      handleDialogClose() {
        this.dialog.form = null;
        this.dialog.mode = '';
      },
      handlePageSizeChange(size) {
        this.search.pageSize = size;
        this.getData(this.search.pageNumber)
      },

      create(val) {
        createConstant(val).then(() => {
          this.$message.success('创建成功');
          this.dialog.visible = false;
          this.getData(this.search.pageNumber);
        }).catch(() => {})
      },
      edit(val) {
        editConstant(val).then(() => {
          this.$message.success('修改成功');
          this.dialog.visible = false;
          this.getData(this.search.pageNumber);
        }).catch(() => {})
      },
      getData(index) {
        const search = this.$objFilter({
          ...this.search,
          pageNumber: index
        }, _ => !!_);
        getConstantList(search).then(({ data }) => {
          if (data.code === 200) {
            this.list = data.body.list || [];
            this.search.pageNumber = data.body.pageNumber;
            this.pageTotal = data.body.totalRecord;
          } else {
            this.list = [];
            this.pageTotal = 0;
          }
        }).catch(() => {
          this.list = [];
          this.pageTotal = 0;
        })
      }
    }
  }
</script>
