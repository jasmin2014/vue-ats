<template>
  <el-form class="protection"
           ref="form"
           :model="form"
           :rules="rules"
           label-width="150px">
    <h4>
      <span>保障方案</span>
    </h4>
    <el-row>
      <el-col :span="8">
        <el-form-item label="保障方式" prop="protectionModel">
          <ats-select v-model="form.protectionModel"
                      :kind="$enum.PROTECTION_MODEL"
                      :group="$enum.PROTECTION_MODEL"
                      :mode="mode"
                      clearable></ats-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label-width="0" :error="planIdError">
      <el-table :data="protectionPlanList" border>
        <el-table-column v-for="(col, index) in table"
                         :label="col.label"
                         :prop="col.prop"
                         :formatter="col.formatter"
                         :width="col.width"
                         :key="index"
                         align="center"></el-table-column>
        <el-table-column label="相关协议" align="center">
          <template slot-scope="scope">
            <a v-if="fileList && fileList[scope.$index]"
               :href="fileList[scope.$index]" target="_blank">查看附件</a>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column v-if="mode !== 'VIEW'"
                         label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-if="currentValue !== scope.row.planId"
                       type="success" size="mini"
                       @click="handleSelect(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  </el-form>
</template>

<script>
  import {mapState} from 'vuex'
  import {getPicUrls} from '../../api/common';

  export default {
    props: {
      value: String,
      model: String,
      mode: String
    },
    data() {
      return {
        currentValue: '',
        form: {
          protectionModel: this.model
        },
        rules: {
          // protectionModel: [
          //   { required: true, message: '请选择保障方式', trigger: 'change' }
          // ]
        },
        table: [
          {
            label: '方案名称',
            prop: 'protectionName'
          },
          {
            label: '保障平台',
            prop: 'protectionOrgName'
          },
          {
            label: '涉及银行卡',
            prop: 'bankAccount'
          }
        ],
        planIdError: '',
        fileList: []
      }
    },
    computed: {
      ...mapState({
        protectionPlanList: state => state.application.protectionPlanList
      })
    },
    watch: {
      value(val) {
        this.currentValue = val;
      },
      model(val, oldVal) {
        if (val !== oldVal) {
          this.$set(this.form, 'protectionModel', val)
        }
      },
      'form.protectionModel'(val, oldVal) {
        if (val !== oldVal) {
          this.$emit('update:model', val);
          this.$store.commit('application/updateProtectionModel', val)
        }
      },
      protectionPlanList(val, oldVal) {
        if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
          if (val.findIndex(_ => _.planId === this.currentValue) === -1) {
            this.$emit('input', '');
          }
        }

        if (val && val.length > 0) {
          const files = val.map(_ => ({ key: _.fileUrl, name: _.fileName }));
          this.getFiles(files);
        } else {
          this.$emit('input', '');
        }
      }
    },

    methods: {
      validate(callback) {
        this.$refs.form.validate((valid) => {
          if (!this.currentValue) {
            // valid = false;
            // this.planIdError = '请选择保障方案'
          } else {
            // this.planIdError = '';
          }
          typeof callback === 'function' && callback(valid);
        })
      },
      clearValidate() {
        this.$refs.form.clearValidate();
      },

      handleSelect(row) {
        this.currentValue = row.planId;
        this.$emit('input', row.planId)
      },
      getFiles(files) {
        getPicUrls(files.map(_ => _.key)).then(({ data }) => {
          if (data.code === 200) {
            this.fileList = (data.body || []).map((_, i) => (_ && files[i].name ? (_ + '&attname=' + encodeURIComponent(files[i].name)) : _));
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-table {
    th, td {
      text-align: center;
      padding: 12px 10px;
    }
  }
</style>
