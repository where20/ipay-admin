<template>
  <div class="app-container">
    <div class="app-container-admin" v-if="role == 0? true:false">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="商户名称">
          <el-input v-model="formInline.merchName" placeholder="商户名称" style="width: 150px;" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="onSearch">查询</el-button>
          <el-button type="primary" @click="onAdd">添加</el-button>
          <!-- <el-button type="danger" @click="onSubmit">批量删除</el-button> -->
        </el-form-item>
      </el-form>
      <el-table
        v-loading="listLoading"
        ref="multipleTable"
        :data="list"
        element-loading-text="拼命加载中"
        border
        fit
        highlight-current-row>
        <el-table-column align="center" label="序号" width="50px">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="商户汇率" align="center">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.fee }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="商户余额" align="center">
          <template slot-scope="scope">
            {{ scope.row.balance }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="商户名称">
          <template slot-scope="scope">
            <span>{{ scope.row.merchName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="商户秘钥">
          <template slot-scope="scope">
            <span>{{ scope.row.signKey }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="150">
          <template slot-scope="scope">
            <!-- <el-button size="small" type="primary">编辑</el-button> -->
            <el-button size="small" type="danger" @click="resetSignKey(scope.row)">重置秘钥</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" @pagination="getList" />

      <el-dialog title="添加商户" :visible.sync="addMerchDialog">
        <el-form :model="addMerchForm" :rules="addMerchRules" ref="addMerchForm" label-width="100px">
          <el-form-item label="商户名称" prop="merchName">
            <el-input v-model="addMerchForm.merchName"></el-input>
          </el-form-item>
          <el-form-item label="商户余额" type="number" prop="balance">
            <el-input v-model="addMerchForm.balance"></el-input>
          </el-form-item>
          <el-form-item label="商户汇率" prop="fee">
            <el-input v-model="addMerchForm.fee"></el-input>
          </el-form-item>
          <!-- <div slot="footer" class="dialog-footer">
            <el-button @click="addUserDialog = false">取 消</el-button>
            <el-button type="primary" @click="addUser(form)">确 定</el-button>
          </div> -->
          <el-form-item>
            <el-button type="primary" @click="submitAddMerchForm('addMerchForm')">立即创建</el-button>
            <el-button @click="resetForm('addMerchForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog title="添加用户" :visible.sync="addUserDialog">
        <el-form :model="addUserForm" :rules="addUserRules" ref="addUserForm">
          <el-form-item label="用户名称" prop="username" :label-width="formLabelWidth">
            <el-input v-model="addUserForm.username"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickName" :label-width="formLabelWidth">
            <el-input v-model="addUserForm.nickName"></el-input>
          </el-form-item>
          <el-form-item label="电子邮箱" prop="email" :label-width="formLabelWidth">
            <el-input v-model="addUserForm.email"></el-input>
          </el-form-item>
          <el-form-item label="小飞机号" prop="telegram" :label-width="formLabelWidth">
            <el-input v-model="addUserForm.telegram"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone" :label-width="formLabelWidth">
            <el-input v-model="addUserForm.phone"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addUserDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitAddUserForm('addUserForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="app-container-merch" v-if="role == 1? true:false">
      <el-card class="box-card">
        <div class="text item">
          <span class="label">商户ID:</span>{{ curMerchInfo.id }}
        </div>
        <div class="text item">
          <span class="label">商户名称:</span>{{ curMerchInfo.merchName }}
        </div>
        <div class="text item">
          <span class="label">商户余额:</span>{{ curMerchInfo. balance }}
        </div>
        <div class="text item">
          <span class="label">商户汇率:</span>{{ curMerchInfo.fee }}
        </div>
        <div class="text item">
          <span class="label">商户秘钥:</span>{{ curMerchInfo.signKey }}
        </div>
        <div class="text item" style="text-align:center;">
          <el-button size="small" type="danger" @click="resetSignKey(curMerchInfo)">重置秘钥</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { getMerchInfo, getCurMerchInfo, resetSkey } from '@/api/merch'
  import { addUserInfo } from '@/api/user'
  import Pagination from '@/components/Pagination'

  export default {
    name: 'Merch',
    components: { Pagination },
    computed: {
      ...mapGetters([
        'role'
      ])
    },
    data() {
      var validateBalance = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入商户余额'));
        } else {
          if (this.addMerchForm.balance !== '') {
            var reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/
            // console.log('regBalance', reg.test(this.addMerchForm.balance))
            if (!reg.test(this.addMerchForm.balance)) {
              callback(new Error('请输入正确的商户余额'));
            }
          }
          callback();
        }
      };
      var validateFee = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入商户汇率'));
        } else {
          if (this.addMerchForm.fee !== '') {
            var reg = /^0\.\d+$/
            // console.log('regFee', reg.test(this.addMerchForm.fee))
            if (!reg.test(this.addMerchForm.fee)) {
              callback(new Error('请输入正确的商户汇率'));
            }
          }
          callback();
        }
      };
      var validateEmail = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入邮箱'));
        } else {
          if (this.addUserForm.email !== '') {
            var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
            // console.log('regEmail', reg.test(this.addUserForm.email))
            if (!reg.test(this.addUserForm.email)) {
              callback(new Error('请输入正确的邮箱'));
            }
          }
          callback();
        }
      };
      var validateTelegram = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入飞机号'));
        } else {
          if (this.addUserForm.telegram !== '') {
            var reg = /[^\u4e00-\u9fa5|,]+/
            console.log('regTelegram', reg.test(this.addUserForm.telegram))
            if (!reg.test(this.addUserForm.telegram)) {
              callback(new Error('请输入正确的飞机号'));
            }
          }
          callback();
        }
      };
      var validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号'));
        } else {
          if (this.addUserForm.phone !== '') {
            var reg = /^1(3|4|5|7|8)\d{9}$/
            // console.log('regPhone', reg.test(this.addUserForm.phone))
            if (!reg.test(this.addUserForm.phone)) {
              callback(new Error('请输入正确的手机号'));
            }
          }
          callback();
        }
      };
      return {
        total: 0,
        listLoading: true,
        listQuery: { //列表初始查询
          page: 1
        },
        list: [],
        formInline: { //列表查询条件
          merchName: ''
        },
        addMerchDialog: false,
        addUserDialog: false,
        formLabelWidth: '80px',
        addUserForm: { // 添加用户字段
          merchName: '',
          merchId: '',
          username: '',
          nickName: '',
          email: '',
          telegram: '',
          phone: ''
        },
        addUserRules: { //添加用户校验
          username: [
            { required: true, message: '请输入用户名称', trigger: 'blur' }
          ],
          nickName: [
            { required: true, message: '请输入用户昵称', trigger: 'blur' }
          ],
          email: [
            { required: true, validator: validateEmail, trigger: 'blur' }
          ],
          telegram: [
            { required: true, validator: validateTelegram, trigger: 'blur' }
          ],
          phone: [
            { required: true, validator: validatePhone, trigger: 'blur' }
          ],
        },
        addMerchForm: { // 添加商户字段
          merchName: '',
          balance: '',
          fee: '',
        },
        addMerchRules: { // 添加商户校验
          merchName: [
            { required: true, message: '请输入商户名称', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          balance: [
            { required: true, validator: validateBalance, trigger: 'blur' }
          ],
          fee: [
            { required: true, validator: validateFee, trigger: 'blur' }
          ],
        },
        curMerchInfo: {
          balance: null,
          fee: null,
          id: null,
          merchName: null,
          signKey: null,
        }
      }
    },
    created() {
      if(this.role == 0) {
        this.getList()
      }else {
        this.getCurMerch()
      }
    },
    methods: {
      // 获取列表
      getList(obj) {
        // var self = this;
        this.listLoading = true
        getMerchInfo(obj).then(response => {
          console.log('response123', response.data)
          const data = response.data
          if(data.code == 101) {
            this.list = data.data.bizContent
            this.total = data.data.count
            this.listLoading = false
          }
          // setTimeout(() => {
          //   this.listLoading = false
          // }, 1.5 * 1000)
        }).catch (reason => {
          console.log(reason)
        })
      },
      // 获取当前商户
      getCurMerch() {
        getCurMerchInfo().then(response => {
          console.log('getCurMerchInfo', response.data)
          const data = response.data
          if(data.code == 101) {
            this.curMerchInfo = data.data
          }
        }).catch (reason => {
          console.log(reason)
        })
      },
      //查询
      onSearch() {
        console.log('search!', this.formInline);
        this.getList(this.formInline);
      },
      //添加
      onAdd() {
        console.log('add!', '添加');
        this.addMerchDialog = true;
      },
      // 添加用户
      addUser(params) {
        addUserInfo(params).then(response => {
          console.log('addUserInfo', response.data)
          const data = response.data
          if(data.code == 101) {
            this.addUserDialog = false
            this.getList()
            this.resetForm('addUserForm')
          }
        }).catch (reason => {
          console.log(reason)
        })
      },
      // 添加商户
      addMerch(params) {
        addMerchInfo(params).then(response => {
          console.log('response123', response.data)
          const data = response.data
          if(data.code == 101) {
            this.addMerchDialog = false
            this.addUserDialog = true
            this.resetForm('addMerchForm')
            this.addUserForm.merchId = data.data.id
            this.addUserForm.merchName = data.data.merchName
          }
        }).catch (reason => {
          console.log(reason)
        })
      },
      // 提交商户添加
      submitAddMerchForm(formName) {
        console.log(this.addMerchForm);
        var self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addMerch(self.addMerchForm);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 提交用户添加
      submitAddUserForm(formName) {
        console.log(this.addUserForm);
        var self = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('submitAddUserForm');
            this.addUser(self.addUserForm);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // 重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      // 重置秘钥
      resetSignKey(row) {
        resetSkey(row.id).then(response => {
          console.log('resetSkey', response.data)
          const data = response.data
          if(data.code == 101) {
            this.$message({
              message: '重置秘钥成功!',
              type: 'success'
            });
            if(this.role == 0) {
              this.getList()
            }else {
              this.getCurMerch()
            }
          }
        }).catch (reason => {
          console.log(reason)
        })
      }
    }
  }
</script>
<style>
  .text {
    font-size: 14px;
  }
  .item {
    padding: 18px 0;
  }
  .label{
    display: inline-block;
    width: 100px;
    text-align: right;
    margin-right: 20px;
  }
  .box-card {
    width: 100%;
  }
</style>
