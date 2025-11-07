<script setup>
import { ref, reactive, computed } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStore } from "../stores/user";
import dayjs from "dayjs";
import { Male, Female, UserFilled } from "@element-plus/icons-vue";

const { t } = useI18n({ useScope: "global" });
const user = useUserStore();

const editing = ref(null); // username of the row being edited
const editForm = reactive({
  username: "",
  nickname: "",
  role: "user",
  age: 18,
  gender: "other",
});

// Filters for table
const filters = reactive({ gender: "all", ageMin: 0, ageMax: 120 });
const genderOrder = { male: 1, female: 2, other: 3 };
const filteredUsers = computed(() => {
  const list = user.users || [];
  return list.filter((u) => {
    const genderOk = filters.gender === "all" || u.gender === filters.gender;
    const ageVal = typeof u.age === "number" ? u.age : 0;
    const ageOk = ageVal >= filters.ageMin && ageVal <= filters.ageMax;
    return genderOk && ageOk;
  });
});

function startEdit(row) {
  editing.value = row.username;
  editForm.username = row.username;
  editForm.nickname = row.nickname;
  editForm.role = row.role;
  editForm.age = row.age;
  editForm.gender = row.gender;
}

function cancelEdit() {
  editing.value = null;
}

function saveEdit() {
  try {
    if (editForm.age < 0 || editForm.age > 120) {
      ElMessage.error(t("common.invalidAgeRange"));
      return;
    }
    user.adminUpdateUser({
      username: editForm.username,
      nickname: editForm.nickname,
      role: editForm.role,
      age: editForm.age,
      gender: editForm.gender,
    });
    ElMessage.success(t("adminPage.saved"));
    editing.value = null;
  } catch (e) {
    ElMessage.error(e?.message || String(e));
  }
}

function remove(row) {
  ElMessageBox.confirm(
    t("adminPage.deleteConfirm", { username: row.username }),
    t("adminPage.deleteTitle"),
    {
      type: "warning",
    }
  )
    .then(() => {
      user.adminDeleteUser(row.username);
      ElMessage.success(t("adminPage.deleted"));
    })
    .catch(() => {});
}

// Create dialog
const showCreate = ref(false);
const createForm = reactive({
  username: "",
  password: "",
  nickname: "",
  role: "user",
  age: 18,
  gender: "other",
});

function openCreate() {
  showCreate.value = true;
  createForm.username = "";
  createForm.password = "";
  createForm.nickname = "";
  createForm.role = "user";
}

function submitCreate() {
  try {
    if (!createForm.username || !createForm.password) {
      throw new Error(t("adminPage.required"));
    }
    if (createForm.age < 0 || createForm.age > 120) {
      throw new Error(t("common.invalidAgeRange"));
    }
    user.adminCreateUser({
      username: createForm.username,
      password: createForm.password,
      role: createForm.role,
      nickname: createForm.nickname || createForm.username,
      age: createForm.age,
      gender: createForm.gender,
    });
    showCreate.value = false;
    ElMessage.success(t("adminPage.created"));
  } catch (e) {
    ElMessage.error(e?.message || String(e));
  }
}
</script>

<template>
  <div class="admin-page">
    <el-card>
      <template #header>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
          "
        >
          <span>{{ t("menu.admin") }}</span>
          <el-button type="primary" @click="openCreate">{{
            t("adminPage.createUser")
          }}</el-button>
        </div>
      </template>

      <!-- Filters toolbar -->
      <div
        style="
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          margin-bottom: 12px;
        "
      >
        <el-select v-model="filters.gender" style="width: 150px">
          <el-option :label="t('common.all')" value="all" />
          <el-option value="male">
            <div style="display: flex; align-items: center; gap: 6px">
              <el-icon><Male /></el-icon>{{ t("common.genderMale") }}
            </div>
          </el-option>
          <el-option value="female">
            <div style="display: flex; align-items: center; gap: 6px">
              <el-icon><Female /></el-icon>{{ t("common.genderFemale") }}
            </div>
          </el-option>
          <el-option value="other">
            <div style="display: flex; align-items: center; gap: 6px">
              <el-icon><UserFilled /></el-icon>{{ t("common.genderOther") }}
            </div>
          </el-option>
        </el-select>
        <el-input-number
          v-model="filters.ageMin"
          :min="0"
          :max="120"
          :step="1"
          controls-position="right"
          :placeholder="t('adminPage.ageMin')"
        />
        <span>-</span>
        <el-input-number
          v-model="filters.ageMax"
          :min="0"
          :max="120"
          :step="1"
          controls-position="right"
          :placeholder="t('adminPage.ageMax')"
        />
        <el-button
          @click="
            filters.gender = 'all';
            filters.ageMin = 0;
            filters.ageMax = 120;
          "
          >{{ t("common.reset") }}</el-button
        >
      </div>

      <el-table :data="filteredUsers" border style="width: 100%">
        <el-table-column type="index" :index="(n) => n + 1" />
        <el-table-column
          :label="t('adminPage.username')"
          prop="username"
          width="150"
        />
        <el-table-column :label="t('adminPage.nickname')" width="220">
          <template #default="{ row }">
            <div v-if="editing === row.username">
              <el-input v-model="editForm.nickname" size="small" />
            </div>
            <div v-else>{{ row.nickname }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="t('adminPage.role')" width="150">
          <template #default="{ row }">
            <div
              v-if="editing === row.username"
              style="display: flex; align-items: center; gap: 8px"
            >
              <el-select
                v-model="editForm.role"
                size="small"
                style="width: 120px"
              >
                <el-option :label="t('auth.admin')" value="admin" />
                <el-option :label="t('auth.user')" value="user" />
              </el-select>
            </div>
            <div v-else>
              <el-tag type="success" v-if="row.role === 'admin'">{{
                t("auth.admin")
              }}</el-tag>
              <el-tag v-else>{{ t("auth.user") }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('adminPage.age')"
          width="150"
          :sortable="true"
          :sort-method="(a, b) => (a.age || 0) - (b.age || 0)"
        >
          <template #default="{ row }">
            <div v-if="editing === row.username">
              <el-input-number
                v-model="editForm.age"
                :min="0"
                :max="120"
                size="small"
              />
            </div>
            <div v-else>{{ row.age }}</div>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('adminPage.gender')"
          width="150"
          :sortable="true"
          :sort-method="(a, b) => genderOrder[a.gender] - genderOrder[b.gender]"
        >
          <template #default="{ row }">
            <div v-if="editing === row.username">
              <el-select
                v-model="editForm.gender"
                size="small"
                style="width: 120px"
              >
                <el-option value="male">
                  <div style="display: flex; align-items: center; gap: 6px">
                    <el-icon><Male /></el-icon>{{ t("common.genderMale") }}
                  </div>
                </el-option>
                <el-option value="female">
                  <div style="display: flex; align-items: center; gap: 6px">
                    <el-icon><Female /></el-icon>{{ t("common.genderFemale") }}
                  </div>
                </el-option>
                <el-option value="other">
                  <div style="display: flex; align-items: center; gap: 6px">
                    <el-icon><UserFilled /></el-icon
                    >{{ t("common.genderOther") }}
                  </div>
                </el-option>
              </el-select>
            </div>
            <div v-else>
              <el-tag v-if="row.gender === 'male'">
                <el-icon style="margin-right: 4px"><Male /></el-icon
                >{{ t("common.genderMale") }}
              </el-tag>
              <el-tag type="warning" v-else-if="row.gender === 'female'">
                <el-icon style="margin-right: 4px"><Female /></el-icon
                >{{ t("common.genderFemale") }}
              </el-tag>
              <el-tag type="info" v-else>
                <el-icon style="margin-right: 4px"><UserFilled /></el-icon
                >{{ t("common.genderOther") }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="t('adminPage.createdAt')" width="200">
          <template #default="{ row }">
            {{ dayjs(row.createdAt).format("YYYY-MM-DD HH:mm") }}
          </template>
        </el-table-column>
        <el-table-column
          :label="t('adminPage.actions')"
          fixed="right"
          min-width="150"
        >
          <template #default="{ row }">
            <div
              v-if="editing === row.username"
              style="display: flex; gap: 8px"
            >
              <el-button type="primary" size="small" @click="saveEdit">{{
                t("adminPage.save")
              }}</el-button>
              <el-button size="small" @click="cancelEdit">{{
                t("adminPage.cancel")
              }}</el-button>
            </div>
            <div v-else style="display: flex; gap: 8px">
              <el-button type="primary" size="small" @click="startEdit(row)">{{
                t("adminPage.edit")
              }}</el-button>
              <el-button
                v-if="row.role !== 'admin'"
                type="danger"
                size="small"
                @click="remove(row)"
              >{{ t("adminPage.delete") }}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="showCreate"
      :title="t('adminPage.createUser')"
      width="480px"
    >
      <el-form label-position="top">
        <el-form-item :label="t('adminPage.username')">
          <el-input v-model="createForm.username" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('auth.password')">
          <el-input
            v-model="createForm.password"
            type="password"
            autocomplete="new-password"
          />
        </el-form-item>
        <el-form-item :label="t('adminPage.nickname')">
          <el-input v-model="createForm.nickname" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('adminPage.age')">
          <el-input-number
            v-model="createForm.age"
            :min="0"
            :max="120"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item :label="t('adminPage.gender')">
          <el-select v-model="createForm.gender" style="width: 100%">
            <el-option value="male">
              <div style="display: flex; align-items: center; gap: 6px">
                <el-icon><Male /></el-icon>{{ t("common.genderMale") }}
              </div>
            </el-option>
            <el-option value="female">
              <div style="display: flex; align-items: center; gap: 6px">
                <el-icon><Female /></el-icon>{{ t("common.genderFemale") }}
              </div>
            </el-option>
            <el-option value="other">
              <div style="display: flex; align-items: center; gap: 6px">
                <el-icon><UserFilled /></el-icon>{{ t("common.genderOther") }}
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="t('adminPage.role')">
          <el-select v-model="createForm.role" style="width: 100%">
            <el-option :label="t('auth.admin')" value="admin" />
            <el-option :label="t('auth.user')" value="user" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreate = false">{{
          t("adminPage.cancel")
        }}</el-button>
        <el-button type="primary" @click="submitCreate">{{
          t("adminPage.create")
        }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.admin-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
