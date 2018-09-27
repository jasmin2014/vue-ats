<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="关键词搜索：">
        <el-input v-model="search.searchKey" style="width: 400px"
                  :placeholder="`请输入 ${placeholderSearchKey}`"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="fa fa-search" @click="handleSearch"></el-button>
      </el-form-item>
    </el-form>
    <el-table :data="list"
              class="highlight-table"
              @current-change="handleSelect"
              highlight-current-row>
      <el-table-column v-for="(col, index) in table" :prop="col.prop" :label="col.label" :key="index">
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination layout="prev, next" :total="total" :page-size="search.pageSize"
                     @current-change="getData"></el-pagination>
    </el-row>
    <el-row type="flex" justify="end" class="mgt20">
      <el-button @click="handleConfirm" type="primary">确 定</el-button>
      <el-button @click="handleCancel">取 消</el-button>
    </el-row>
  </div>
</template>

<script>
  export default {
    props: {
      list: Array,
      table: Array,
      total: Number,
      type: String
    },
    data() {
      return {
        search: {
          searchKey: '',
          pageSize: 5,
          pageNumber: 1
        },
        selected: {}
      }
    },
    computed: {
      placeholderSearchKey() {
        return this.type === this.$enum.SUBJECT_PROP_ORGANIZE ? '企业名称/统一社会信用代码/法人姓名/客户编号' : '客户姓名/身份证号码/客户编号'
      }
    },
    methods: {
      handleSearch() {
        this.getData(1)
      },
      handleSelect(val) {
        if (val) {
          this.selected = val;
        }
      },
      handleConfirm() {
        this.$emit('confirm', this.selected)
      },
      handleCancel() {
        this.$emit('cancel')
      },
      getData(index) {
        const search = this.$objFilter(this.$deepcopy(this.search), _ => _ !== '');
        search.pageNumber = index;
        this.$emit('search', search)
      },
      clear() {
        this.search.searchKey = '';
      }
    }
  }
</script>
