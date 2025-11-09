<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import dayjs from 'dayjs'
import { useNotificationsStore } from '../stores/notifications'
import { ElMessage } from 'element-plus'

const { t } = useI18n({ useScope: 'global' })
const noti = useNotificationsStore()
// 首次进入页面时，若未持久化数据且列表为空则填充预设通知
noti.seedDefaults()

// Dialog states for adding notifications
const showAddDialog = ref(false)
const dialogContent = ref('')
const dialogSetCurrent = ref(false)
const selectedType = ref('dashboard')
const itemsByType = computed(() => (noti.items || []).filter((n) => n.type === selectedType.value))
const currentIdForType = computed(() => noti.currentByType?.[selectedType.value] || null)

// Map dashboard strategy to a simple checkbox for scrolling
const isDashboardScroll = computed({
  get() {
    return noti.dashboardStrategy === 'marquee'
  },
  set(val) {
    noti.setDashboardStrategy(val ? 'marquee' : 'static')
  },
})

function openAddDialog() {
  dialogContent.value = ''
  dialogSetCurrent.value = false
  showAddDialog.value = true
}

function confirmAdd() {
  const item = noti.add(dialogContent.value, selectedType.value)
  if (item) {
    if (dialogSetCurrent.value) {
      noti.setCurrentByType(selectedType.value, item.id)
      ElMessage.success(t('notificationsPage.added'))
    } else {
      ElMessage.success(t('notificationsPage.addedOnly'))
    }
    showAddDialog.value = false
  } else {
    ElMessage.error(t('notificationsPage.required'))
  }
}

function setCurrent(id) {
  noti.setCurrentByType(selectedType.value, id)
  ElMessage.success(t('notificationsPage.setCurrentDone'))
}

function cancelCurrent() {
  noti.unsetCurrentByType(selectedType.value)
  ElMessage.success(t('notificationsPage.unsetCurrentDone'))
}

function remove(id) {
  noti.remove(id)
  ElMessage.success(t('notificationsPage.removed'))
}

function toggleDashboard(val) {
  noti.setDashboardEnabled(val)
}

// removed unused strategy/autoClose handlers after UI simplification

// 当前通知高亮：根据是否为当前通知返回行类名（Element Plus 传入的是 row 对象）
function rowClassName(row) {
  const rid = row && row.id
  return rid && rid === currentIdForType.value ? 'is-current' : ''
}
</script>

<template>
  <div class="notifications-page">
    <el-card>
      <el-tabs type="card" v-model="selectedType">
        <el-tab-pane :label="t('notificationsPage.typeDashboard')" name="dashboard">
          <div class="section-title">{{ t('notificationsPage.settingsTitle') }}</div>
          <div class="tab-toolbar">
            <div class="toolbar-item">
              <el-checkbox v-model="noti.dashboardEnabled" @change="toggleDashboard">{{ t('notificationsPage.dashboardShow') }}</el-checkbox>
            </div>
            <div class="toolbar-item">
              <el-checkbox v-model="isDashboardScroll">{{ t('notificationsPage.dashboardScroll') }}</el-checkbox>
            </div>
            <div class="flex-spacer" />
            <el-button type="primary" @click="openAddDialog">{{ t('notificationsPage.addNotification') }}</el-button>
          </div>
          <div class="section-title">{{ t('notificationsPage.listTitle') }}</div>

          <el-table :data="itemsByType" style="width:100%" size="small" :row-class-name="rowClassName">
            <el-table-column :label="t('notificationsPage.content')">
              <template #default="{ row }">
                {{ row.content }}
              </template>
            </el-table-column>
            <el-table-column :label="t('notificationsPage.createdAt')" width="180">
              <template #default="{ row }">
                {{ dayjs(row.createdAt).format('YYYY-MM-DD HH:mm') }}
              </template>
            </el-table-column>
            <el-table-column :label="t('notificationsPage.actions')" width="260" fixed="right">
              <template #default="{ row }">
                <el-button
                  v-if="row.id !== currentIdForType"
                  size="small"
                  type="primary"
                  @click="setCurrent(row.id)"
                >{{ t('notificationsPage.use') }}</el-button>
                <el-button
                  v-else
                  size="small"
                  type="warning"
                  @click="cancelCurrent"
                >{{ t('notificationsPage.cancel') }}</el-button>
                <el-button size="small" type="danger" @click="remove(row.id)">{{ t('notificationsPage.delete') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-if="itemsByType.length === 0" :description="''" />
      </el-tab-pane>

        <el-tab-pane :label="t('notificationsPage.typeGlobal')" name="global">
          <div class="section-title">{{ t('notificationsPage.settingsTitle') }}</div>
          <div class="tab-toolbar">
            <div class="toolbar-item">
              <el-checkbox v-model="noti.globalLoginNotifyEnabled" @change="noti.setGlobalLoginNotifyEnabled">{{ t('notificationsPage.globalLoginNotifyLabel') }}</el-checkbox>
            </div>
            <div class="toolbar-item">
              <el-checkbox v-model="noti.globalReturnNotifyEnabled" @change="noti.setGlobalReturnNotifyEnabled">{{ t('notificationsPage.globalReturnNotifyLabel') }}</el-checkbox>
            </div>
            <div class="flex-spacer" />
          </div>
          <div class="type-hint">{{ t('notificationsPage.noExtraConfigModal') }}</div>
        </el-tab-pane>

        <el-tab-pane :label="t('notificationsPage.typeSidebar')" name="sidebar">
          <div class="section-title">{{ t('notificationsPage.settingsTitle') }}</div>
          <div class="tab-toolbar">
            <div class="toolbar-item type-hint">{{ t('notificationsPage.noExtraConfigSidebar') }}</div>
            <div class="flex-spacer" />
            <el-button type="primary" @click="openAddDialog">{{ t('notificationsPage.addNotification') }}</el-button>
          </div>
          <div class="section-title">{{ t('notificationsPage.listTitle') }}</div>

          <el-table :data="itemsByType" style="width:100%" size="small" :row-class-name="rowClassName">
            <el-table-column :label="t('notificationsPage.content')">
              <template #default="{ row }">
                {{ row.content }}
              </template>
            </el-table-column>
            <el-table-column :label="t('notificationsPage.createdAt')" width="180">
              <template #default="{ row }">
                {{ dayjs(row.createdAt).format('YYYY-MM-DD HH:mm') }}
              </template>
            </el-table-column>
            <el-table-column :label="t('notificationsPage.actions')" width="260" fixed="right">
              <template #default="{ row }">
                <el-button
                  v-if="row.id !== currentIdForType"
                  size="small"
                  type="primary"
                  @click="setCurrent(row.id)"
                >{{ t('notificationsPage.use') }}</el-button>
                <el-button
                  v-else
                  size="small"
                  type="warning"
                  @click="cancelCurrent"
                >{{ t('notificationsPage.cancel') }}</el-button>
                <el-button size="small" type="danger" @click="remove(row.id)">{{ t('notificationsPage.delete') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-if="itemsByType.length === 0" :description="''" />
        </el-tab-pane>

        <el-tab-pane :label="t('notificationsPage.typeModal')" name="modal">
          <div class="section-title">{{ t('notificationsPage.settingsTitle') }}</div>
          <div class="tab-toolbar">
            <div class="toolbar-item type-hint">{{ t('notificationsPage.noExtraConfigModal') }}</div>
            <div class="flex-spacer" />
            <el-button type="primary" @click="openAddDialog">{{ t('notificationsPage.addNotification') }}</el-button>
          </div>
          <div class="section-title">{{ t('notificationsPage.listTitle') }}</div>

          <el-table :data="itemsByType" style="width:100%" size="small" :row-class-name="rowClassName">
            <el-table-column :label="t('notificationsPage.content')">
              <template #default="{ row }">
                {{ row.content }}
              </template>
            </el-table-column>
            <el-table-column :label="t('notificationsPage.createdAt')" width="180">
              <template #default="{ row }">
                {{ dayjs(row.createdAt).format('YYYY-MM-DD HH:mm') }}
              </template>
            </el-table-column>
            <el-table-column :label="t('notificationsPage.actions')" width="260" fixed="right">
              <template #default="{ row }">
                <el-button
                  v-if="row.id !== currentIdForType"
                  size="small"
                  type="primary"
                  @click="setCurrent(row.id)"
                >{{ t('notificationsPage.use') }}</el-button>
                <el-button
                  v-else
                  size="small"
                  type="warning"
                  @click="cancelCurrent"
                >{{ t('notificationsPage.cancel') }}</el-button>
                <el-button size="small" type="danger" @click="remove(row.id)">{{ t('notificationsPage.delete') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-if="itemsByType.length === 0" :description="''" />
        </el-tab-pane>
      </el-tabs>
      <el-dialog v-model="showAddDialog" :title="t('notificationsPage.addDialogTitle')" width="520px">
        <el-form label-position="top">
          <el-form-item :label="t('notificationsPage.newContent')">
            <el-input v-model="dialogContent" type="textarea" :rows="4" :placeholder="t('notificationsPage.placeholder')" />
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="dialogSetCurrent">{{ t('notificationsPage.setAsCurrent') }}</el-checkbox>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="showAddDialog=false">{{ t('notificationsPage.cancel') }}</el-button>
          <el-button type="primary" @click="confirmAdd">{{ t('notificationsPage.confirm') }}</el-button>
        </template>
      </el-dialog>
    </el-card>

    

    
  </div>
</template>

<style scoped>
.notifications-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.section-title {
  font-size: 14px;
  color: #606266;
  font-weight: 600;
  margin: 8px 0;
}
.type-hint {
  color: #909399;
  margin-bottom: 8px;
}
 .tab-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 8px;
  /* border-bottom: 1px solid var(--el-border-color); */
  margin-bottom: 12px;
  flex-wrap: wrap;
 }
 /* removed toolbar-label styling (no longer used) */
 .flex-spacer { flex: 1; }
 
 /* 强化当前行高亮：背景 + 左侧色条 +内容加粗 */
 .is-current > td {
  background-color: var(--el-color-primary-light-9);
 }
 .is-current > td:first-child { position: relative; }
 .is-current > td:first-child::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: var(--el-color-primary);
 }
 .is-current > td:first-child .cell {
  font-weight: 600;
  color: var(--el-color-primary);
 }
 
</style>