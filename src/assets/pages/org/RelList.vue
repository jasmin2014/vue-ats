<template>
  <div class="rel-list">
    <el-form class="form-label flex fixed-width">
      <el-row>
        <el-col :span="6">
          <el-form-item label="资金机构">
            <ats-select v-model="search.fundOrgId"
                        :org="this.$enum.BUSINESS_INTENTION_FUND"
                        placeholder="全部"
                        hide-disabled-org
                        clearable></ats-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="fa fa-search" title="搜索"
                     @click="handleSearch"></el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table :data="list" border>
      <el-table-column v-for="(col, i) in table" :key="i"
                       :label="col.label"
                       :prop="col.prop"
                       align="center"></el-table-column>
    </el-table>

    <el-row type="flex" justify="center" class="mgt20">
      <el-pagination :total="pageTotal" :page-size="search.pageSize"
                     layout="total, prev, pager, next, jumper, sizes" :page-sizes="[20, 50, 100]"
                     @current-change="getData" @size-change="handlePageSizeChange"></el-pagination>
    </el-row>
  </div>
</template>

<script>
  import {getOrgRelList} from '../../api/org';

  export default {
    data() {
      return {
        list: [],
        search: {
          pageSize: 20,
          pageNumber: 1
        },
        pageTotal: 0,
        table: [
          {
            label: '资金机构',
            prop: 'fundOrgName'
          },
          {
            label: '资金机构ID',
            prop: 'fundOrgId'
          },
          {
            label: '协议到期日',
            prop: 'endDate'
          },
          {
            label: '创建时间',
            prop: 'createdTime'
          },
          {
            label: '创建人',
            prop: 'createdBy'
          }
        ]
      }
    },

    created() {
      this.getData(1);
    },

    methods: {
      handleSearch() {
        this.getData(1);
      },
      handlePageSizeChange(size) {
        this.search.pageSize = size;
        this.getData(this.search.pageNumber)
      },

      getData(index) {
        const search = {
          ...this.search,
          pageNumber: index
        };

        getOrgRelList(search).then(({ data }) => {
          if (data.code === 200) {
            this.list = data.body.list;
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
