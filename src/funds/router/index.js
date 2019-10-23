import Main from '../../components/layout/Main.vue'
import Public from '../../components/layout/Public.vue'
import ErrorNotFound from '../../components/error/NotFound.vue'
import ErrorUnauthorized from '../../components/error/Unauthorized.vue'
// org
import OrgDetail from '../pages/org/Detail.vue'
import OrgEdit from '../pages/org/Edit.vue'
import OrgRelList from '../pages/org/RelList'
// asset
import AssetSetting from '../pages/asset/Setting.vue'
import AssetConfig from '../pages/asset/Config.vue'
import AssetRateConfig from '../pages/asset/RateConfig'
import AssetApplyList from '../pages/asset/apply/List.vue';
import AssetApplyDetail from '../pages/asset/apply/Detail.vue';
import AssetPublicList from '../pages/asset/public/List.vue';
import AssetStoreList from '../pages/asset/store/List.vue';
import AssetStoreDetail from '../pages/asset/store/Detail.vue';
import AssetStorePush from '../pages/asset/store/Push.vue';
import AssetStoredList from '../pages/asset/stored/List.vue';
import AssetStoredDetail from '../pages/asset/store/Detail.vue';
import AssetStoredPush from '../pages/asset/store/Push.vue';
// operation
import OperationPlanList from '../pages/operation/PlanList.vue';
import OperationPlanDetail from '../pages/operation/PlanDetail.vue';
import OperationLoanList from '../pages/operation/LoanList.vue';
import OperationPlannedBillList from '../pages/operation/RecList.vue';
import OperationActualBillList from '../pages/operation/ActList.vue';
import OperationStatList from '../pages/operation/StatList.vue'
// account
import AccountRoleList from '../pages/account/RoleList.vue'
import AccountUserList from '../pages/account/UserList.vue'

export default {
  'Home': Main,
  'Error': Public,
  'ErrorNotFound': ErrorNotFound,
  'ErrorUnauthorized': ErrorUnauthorized,
  'Org': Public,
  'OrgInfo': Public,
  'OrgDetail': OrgDetail,
  'OrgEdit': OrgEdit,
  'OrgRel': Public,
  'OrgRelList': OrgRelList,
  'Asset': Public,
  'AssetSetting': Public,
  'AssetSettingInfo': AssetSetting,
  'AssetApply': Public,
  'AssetApplyList': AssetApplyList,
  'AssetApplyDetail': AssetApplyDetail,
  'AssetPublic': Public,
  'AssetPublicList': AssetPublicList,
  'AssetPublicDetail': AssetApplyDetail,
  'AssetPublicSetting': AssetSetting,
  'AssetStore': Public,
  'AssetStoreList': AssetStoreList,
  'AssetStoreDetail': AssetStoreDetail,
  'AssetStorePush': AssetStorePush,
  'AssetStored': Public,
  'AssetStoredList': AssetStoredList,
  'AssetStoredDetail': AssetStoredDetail,
  'AssetStoredPush': AssetStoredPush,
  'AssetConfig': Public,
  'AssetConfigParam': Public,
  'AssetConfigParamInfo': AssetConfig,
  'AssetConfigFee': Public,
  'AssetConfigFeeInfo': AssetRateConfig,
  'Operation': Public,
  'OperationPlan': Public,
  'OperationPlanList': OperationPlanList,
  'OperationPlanDetail': OperationPlanDetail,
  'OperationLoan': Public,
  'OperationLoanList': OperationLoanList,
  'OperationPlannedBill': Public,
  'OperationPlannedBillList': OperationPlannedBillList,
  'OperationActualBill': Public,
  'OperationActualBillList': OperationActualBillList,
  'OperationStat': Public,
  'OperationStatList': OperationStatList,
  'Account': Public,
  'AccountRole': Public,
  'AccountRoleList': AccountRoleList,
  'AccountUser': Public,
  'AccountUserList': AccountUserList
}
