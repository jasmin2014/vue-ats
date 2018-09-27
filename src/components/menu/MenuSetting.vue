<template>
  <div>
    <el-row>
      <ats-select v-model="appId"
                  :kind="this.$enum.BUSINESS"
                  :group="this.$enum.BUSINESS"
                  placeholder="选择业务端"
                  @change="handleAppChange"
                  clearable>
      </ats-select>
    </el-row>
    <el-row class="mgt20">
      <el-tree class="menu-tree"
               :data="menuList"
               :props="treeProps"
               node-key="id"
               :render-content="renderContent">
      </el-tree>
    </el-row>

    <el-dialog :visible.sync="showDialog"
               width="700px"
               @close="handleDialogClose">
      <el-form label-width="100px">
        <el-form-item label="id">
          <el-input v-model.trim="currentNode.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="业务端(appId)">
          <ats-select v-model.trim="currentNode.appId"
                      :kind="this.$enum.BUSINESS"
                      :group="this.$enum.BUSINESS"
                      disabled></ats-select>
        </el-form-item>
        <el-form-item label="标题(tname)">
          <el-input v-model.trim="currentNode.tname"></el-input>
        </el-form-item>
        <el-form-item label="组件名(name)">
          <el-input v-model.trim="currentNode.name"></el-input>
        </el-form-item>
        <el-form-item label="路径(url)">
          <el-input v-model.trim="currentNode.url"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型">
          <el-select v-model="currentNode.structureType">
            <el-option v-for="option in structureTypeList" :key="option.value"
                       :label="option.text" :value="option.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="actionCode">
          <el-input v-model.trim="currentNode.actionCode" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" align="center">
        <el-button type="primary"
                   @click="handleSave">保存</el-button>
        <el-button @click="showDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {getAuthList} from '../../center/api/account';
  import {
    getMenuDetail,
    insertMenuAfter,
    insertMenuBefore,
    appendChildMenu,
    editMenu,
    deleteMenu
  } from '../../api/menu';

  const STRUCTURE_TYPE_LIST = [
    {
      text: '菜单',
      value: 'MENU'
    },
    {
      text: '页面',
      value: 'PAGE'
    },
    {
      text: '按钮',
      value: 'BUTTON'
    }
  ];

  export default {
    data() {
      return {
        appId: '',
        menuList: [],
        treeProps: {
          'label': 'tname'
        },
        showDialog: false,
        currentNode: {},
        currentId: '',
        mode: '',
        structureTypeList: STRUCTURE_TYPE_LIST
      }
    },
    methods: {
      handleEdit(item) {
        this.mode = 'EDIT';
        getMenuDetail(item.id).then(({data}) => {
          this.currentNode = data.body;
          this.showDialog = true;
        })
      },
      handleInsertBefore(data) {
        this.mode = 'BEFORE';
        this.currentId = data.id;
        this.currentNode.appId = this.appId;
        this.showDialog = true;
      },
      handleInsertAfter(data) {
        this.mode = 'AFTER';
        this.currentId = data.id;
        this.currentNode.appId = this.appId;
        this.showDialog = true;
      },
      handleAppend(data) {
        this.mode = 'APPEND';
        this.currentId = data.id;
        this.currentNode.appId = this.appId;
        this.showDialog = true;
      },
      handleDelete(data) {
        this.$confirm('确定删除?', '提示', {
          type: 'warning'
        }).then(() => {
          deleteMenu(this.appId, data.id).then(({status}) => {
            if (status === 204) {
              this.handleAppChange(this.appId);
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            }
          })
        }).catch(() => {})
      },
      handleSave() {
        let promise = {};
        switch (this.mode) {
          case 'EDIT':
            promise = editMenu(this.currentNode);
            break;
          case 'BEFORE':
            promise = insertMenuBefore(this.currentId, this.currentNode);
            break;
          case 'AFTER':
            promise = insertMenuAfter(this.currentId, this.currentNode);
            break;
          case 'APPEND':
            promise = appendChildMenu(this.currentId, this.currentNode);
            break;
          default:
            break;
        }
        promise.then(({status}) => {
          this.handleAppChange(this.appId);
          if (status === 200 || status === 201) {
            this.showDialog = false;
          }
        }).catch(() => {});
      },
      handleDialogClose() {
        this.currentNode = {};
      },
      handleAppChange(appId) {
        getAuthList(appId).then(({data}) => {
          this.menuList = [data.body];
        })
      },
      renderContent(h, {node, data, store}) {
        return h('span', { class: 'custom-tree-node' }, [
          `[${node.data.actionCode}] [${node.data.structureType}] \t${node.data.tname} \t(${node.data.name})`,
          h('div', null, [
            h('el-button', {
              props: {
                size: 'mini',
                icon: 'el-icon-edit'
              },
              on: {
                click: (e) => {
                  e.stopPropagation();
                  this.handleEdit(node.data)
                }
              }
            }, ''),
            h('el-button', {
              attrs: {
                disabled: node.level === 1
              },
              props: {
                size: 'mini'
              },
              on: {
                click: (e) => {
                  e.stopPropagation();
                  this.handleInsertBefore(node.data)
                }
              }
            }, 'Insert Before'),
            h('el-button', {
              attrs: {
                disabled: node.level === 1
              },
              props: {
                size: 'mini'
              },
              on: {
                click: (e) => {
                  e.stopPropagation();
                  this.handleInsertAfter(node.data)
                }
              }
            }, 'Insert After'),
            h('el-button', {
              attrs: {
                title: 'Append Child',
                disabled: node.level >= 4
              },
              props: {
                size: 'mini',
                icon: 'el-icon-plus'
              },
              on: {
                click: (e) => {
                  e.stopPropagation();
                  this.handleAppend(node.data)
                }
              }
            }, ''),
            h('el-button', {
              attrs: {
                disabled: node.level === 1 || !node.isLeaf
              },
              props: {
                size: 'mini',
                icon: 'el-icon-delete'
              },
              on: {
                click: (e) => {
                  e.stopPropagation();
                  this.handleDelete(node.data)
                }
              }
            }, '')
          ])
        ])
      }
    }
  }
</script>

<style lang="scss">
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .menu-tree {
    .el-tree-node__content {
      height: 40px;
    }
  }
</style>
