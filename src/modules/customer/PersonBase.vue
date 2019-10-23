<template>
  <div class="person-base">
    <el-form ref="form"
             v-if="currentValue"
             :model="currentValue"
             :rules="mode !== 'VIEW' ? rules : {}"
             label-width="150px">
      <div class="base">
        <h4>
          <span>基本信息</span>
        </h4>
        <el-row>
          <el-col :span="8">
            <el-form-item label="婚姻状况">
              <ats-select v-model="currentValue.marriage" :mode="mode" clearable
                          :kind="this.$enum.MARRIAGE_STATUS" :group="this.$enum.MARRIAGE_STATUS"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="住房状况">
              <ats-select v-model="currentValue.homeType" :mode="mode" clearable
                          :kind="this.$enum.HOUSE_STATUS" :group="this.$enum.HOUSE_STATUS"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="学历">
              <ats-select v-model="currentValue.education" :mode="mode" clearable
                          :kind="this.$enum.EDUCATION" :group="this.$enum.EDUCATION_GROUP"></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="年收入(万元)" prop="pmIncome" :error="error.pmIncome">
              <ats-select v-model="currentValue.pmIncome" :mode="mode"
                          :kind="this.$enum.INCOME_YEAR" :group="this.$enum.INCOME_YEAR"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所在省份" prop="province" :error="error.region">
              <ats-select v-model="currentValue.province"
                          :mode="mode"
                          region="86"></ats-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所在城市" prop="city" :error="error.region">
              <ats-select v-model="currentValue.city"
                          :mode="mode"
                          :region="currentValue.province"></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="工作性质" prop="workNature">
              <ats-select v-model="currentValue.workNature" :mode="mode"
                          :kind="this.$enum.WORK_NATURE" :group="this.$enum.WORK_NATURE"></ats-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="contact">
        <h4>
          <span>联系方式</span>
        </h4>
        <el-row>
          <el-col :span="8">
            <el-form-item label="手机号码" prop="mobile" :error="error.mobile">
              <ats-input v-model.trim="currentValue.mobile"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电话号码" prop="telephone" :error="error.telephone">
              <ats-input v-model.trim="currentValue.telephone"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="家庭住址" prop="homeAddress" :error="error.homeAddress">
              <ats-input v-model.trim="currentValue.homeAddress"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="常住地址" prop="residentAddress" :error="error.residentAddress">
              <ats-input v-model.trim="currentValue.residentAddress"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="户籍地址" prop="domicileAddress" :error="error.domicileAddress">
              <ats-input v-model.trim="currentValue.domicileAddress"
                         :mode="mode"></ats-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="relations">
        <h4>
          <span>联系人信息</span>
        </h4>
        <!--亲属联系人-->
        <relation ref="relation"
                  v-if="mode !== 'VIEW' || (currentValue.relationships && currentValue.relationships.length > 0)"
                  v-model="currentValue.relationships"
                  :is-upload="isUpload"
                  :mode="mode"
                  :encode="encode"></relation>
        <!--朋友联系人-->
        <friend ref="friend"
                v-if="mode !== 'VIEW' || (currentValue.friendships && currentValue.friendships.length > 0)"
                v-model="currentValue.friendships"
                :is-upload="isUpload"
                :mode="mode"
                :encode="encode"></friend>
      </div>
      <div class="work">
        <el-row>
          <h4><span>单位信息</span></h4>
        </el-row>
        <work ref="work"
              v-model="currentValue.loanPersonCustomerWorkHisDTO"
              :mode="mode"></work>
      </div>
      <div class="materials">
        <h4>
          <span>证件照片</span>
        </h4>
        <el-row type="flex" justify="center">
          <el-form-item label-width="0" prop="materials">
            <ats-upload v-model="materials"
                        :limit="10"
                        text="证件照片"
                        :mode="mode"
                        @success="handleUploadMaterial"
                        @remove="handleRemoveMaterial"></ats-upload>
          </el-form-item>
        </el-row>
      </div>
      <div class="risk">
        <debt v-if="currentValue.personDebtInformationList"
              v-model="currentValue.personDebtInformationList"></debt>
        <credit-data v-if="currentValue.creditDataDTO"
                     v-model="currentValue.creditDataDTO"></credit-data>
        <involved v-if="currentValue.involvedAppealDTO"
                  v-model="currentValue.involvedAppealDTO"></involved>
      </div>
    </el-form>
  </div>
</template>

<script>
  import Relation from '../prop/Relation'
  import Friend from '../prop/Friend'
  import Work from '../prop/Work'
  import Debt from '../risk/Debt'
  import CreditData from '../risk/CreditData'
  import Involved from '../risk/Involved'

  export default {
    components: {
      Relation,
      Friend,
      Work,
      Debt,
      CreditData,
      Involved
    },

    props: {
      value: Object,
      mode: String,
      error: {
        type: Object,
        default() {
          return {};
        }
      },
      isUpload: Boolean,
      encode: Boolean
    },
    data() {
      return {
        currentValue: this.$deepcopy(this.value),
        rules: {
          // 基本信息
          pmIncome: [
            { required: true, message: '请选择年收入', trigger: 'change' }
          ],
          workNature: [
            { required: true, message: '请选择工作性质', trigger: 'change' }
          ],
          province: [
            { required: true, message: '请选择客户所在省份', trigger: 'change' }
          ],
          city: [
            { required: true, message: '请选择客户所在城市', trigger: 'change' }
          ],
          mobile: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { pattern: this.$valid.mobile, message: '请输入正确的手机号码', trigger: 'blur' }
          ],
          telephone: [
            { pattern: this.$valid.telephone, message: '请输入正确的电话号码', trigger: 'blur' }
          ],
          homeAddress: [
            { min: 0, max: 100, message: '100字以内', trigger: 'blur' }
          ],
          residentAddress: [
            { min: 0, max: 100, message: '100字以内', trigger: 'blur' }
          ],
          domicileAddress: [
            { min: 0, max: 100, message: '100字以内', trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      disableEdit() {
        return this.mode === 'EDIT' ? 'VIEW' : this.mode;
      },
      materials: {
        get() {
          if (this.currentValue.materials) {
            return this.currentValue.materials.map((_, index) => ({
              id: _.id || index + 1,
              name: _.fileName,
              type: _.fileType,
              url: _.fileUri
            }));
          } else {
            return []
          }
        },
        set(val) {
          if (val) {
            this.currentValue.materials = val.map((_, index) => ({
              id: typeof _.id === 'number' && _.id < 100000 ? index + 1 : _.id, // 每次重新更新index id，保留组件生成id
              fileName: _.name,
              fileUri: _.url,
              fileType: _.type,
              kind: this.$enum.PROOF_MATERIAL_P_ID_CARD
            }))
          } else {
            this.currentValue.materials = [];
          }
        }
      }
    },
    watch: {
      value: {
        handler(val) {
          this.setCurrentValue(val);
        },
        deep: true
      }
    },

    methods: {
      save(callback) {
        let isValid = true;
        this.$refs.form.validate((valid) => {
          if (!valid) isValid = false;
        });

        this.$refs.relation.validate((valid) => {
          if (!valid) isValid = false;
        });

        this.$refs.friend.validate((valid) => {
          if (!valid) isValid = false;
        });

        this.$refs.work.validate((valid) => {
          if (!valid) isValid = false;
        });

        if (isValid) {
          this.$emit('input', this.$deepcopy(this.currentValue));
        }
        typeof callback === 'function' && callback(isValid);
      },
      setCurrentValue(val) {
        if (this.encode) {
          val.mobile = this.$encoder.mobile(val.mobile);
          val.relationships && val.relationships.forEach(_ => {
            _.realName = this.$encoder.personName(_.realName);
            _.mobile = this.$encoder.mobile(_.mobile);
          });
          val.friendships && val.friendships.forEach(_ => {
            _.realName = this.$encoder.personName(_.realName);
            _.mobile = this.$encoder.mobile(_.mobile);
          });
        }
        this.currentValue = this.$deepcopy(val);
      },
      handleUploadMaterial(file) {
        this.materials = this.materials.concat([{
          id: file.uid,
          url: file.key,
          name: file.name,
          type: file.type
        }]);

        if (this.mode === 'EDIT') {
          console.log('ADD' + file.uid);
          this.$store.commit('material/add', {
            uid: file.uid,
            fileUri: file.key,
            fileName: file.name,
            fileType: file.type,
            kind: this.$enum.PROOF_MATERIAL_P_ID_CARD
          })
        }
      },
      handleRemoveMaterial(file) {
        this.materials = this.materials.filter(_ => _.id !== file.id);

        if (this.mode === 'EDIT') {
          console.log('DELETE' + file.id);
          this.$store.commit('material/delete', {
            id: file.id
          })
        }
      }
    }
  }
</script>
