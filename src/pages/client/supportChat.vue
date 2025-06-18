<script setup lang="ts">
import "@/assets/css/vendors/simplebar.css";
import Lucide from "@/components/Base/Lucide";
import { Menu } from "@/components/Base/Headless";
import { FormInput, FormTextarea } from "@/components/Base/Form";
import Tippy from "@/components/Base/Tippy";
import { Tab } from "@/components/Base/Headless";
import Button from "@/components/Base/Button";
import { onMounted, ref } from "vue";
import SimpleBar from "simplebar";
import _ from "lodash";
import CreateticketDialog from "@/components/BotComponents/SupportTicket/CreateticketDialog.vue";
import apiClient from '../../services/apiService';
import { Dialog } from "@/components/Base/Headless";
const isConfirmDialogVisible = ref(false);
const scrollableRef = ref<HTMLDivElement>();
const message = ref("");
const selectedTicketId = ref(null);
// State for success modal
const successModalPreview = ref(false);
const errorModalVisible = ref(false);
const errorMessage = ref('');
const error = ref('');
// Emit event to notify parent of close action
const emit = defineEmits(["close"]);
// Close the modal
const closeDialog = () => {
  emit("close");
};
onMounted(() => {
  if (scrollableRef.value) {
    new SimpleBar(scrollableRef.value);
  }
});


// State for tickets and loading
const ticketList = ref([]); // To store fetched ticket list
const ticketDetails = ref([]); // To store detailed data for tickets
const isLoading = ref(false); // Loading state for better UX

// Fetch ticket list from the API
const fetchTicketList = async () => {
  try {
    isLoading.value = true;
    const response = await apiClient.get("/ticket/ticket-list");
    ticketList.value = response.data?.result?.client_tickets || [];
    console.log("Fetched ticket list:", ticketList.value);
  } catch (error) {
    console.error("Error fetching ticket list:", error);
  } finally {
    isLoading.value = false;
  }
};

// Fetch ticket data when a ticket is selected
const fetchTicketData = async (ticket_id) => {
  try {
    ticketDetails.value = null; // Clear previous ticket details
    const response = await apiClient.get(`/ticket/data/${ticket_id}`);
    ticketDetails.value = response.data?.result?.ticket_data || null;
    selectedTicketId.value = ticket_id;
    console.log(`Selected ticket ID: ${selectedTicketId.value}`); // Log to verify

    console.log(`Fetched data for ticket_id ${ticket_id}:`, ticketDetails.value);
  } catch (error) {
    console.error(`Error fetching data for ticket_id ${ticket_id}:`, error);
  }
};

// Fetch ticket list on component mount
onMounted(fetchTicketList);

const handleSubmit = async () => {
  // Validate inputs
  if (!message.value.trim()) {
    console.error("Validation failed: Message cannot be empty.");
    return;
  }
  try {
    // Prepare the payload
    const payload = {
      message: message.value, // Pass the typed message
      ticket_id: selectedTicketId.value, // Pass the ticket ID from selectedTicketId
    };

    // Call the ticket reply API with the payload
    const response = await apiClient.post("/ticket/reply", payload);

    console.log("Ticket reply sent successfully:", response.data);
    successModalPreview.value = true; // Show success modal
    closeDialog(); // Close the dialog/modal after successful submission
  } catch (error) {
    console.error("Error sending message:", error.response?.data || error);
    errorModalVisible.value = true;
    //alert("Error sending message. Please try again.");
  }
};

function handleRefresh() {
  successModalPreview.value = false;
  window.location.reload();
}
</script>

<template>
  <div class="grid grid-cols-12 gap-y-10 gap-x-6">
    <div class="col-span-12">
      <div class="flex flex-col mt-4 md:mt-0 md:h-10 gap-y-3 md:items-center md:flex-row">
        <div class="text-base font-medium group-[.mode--light]:text-white">
          Support Chat
        </div>
        <div class="flex flex-col sm:flex-row gap-x-3 gap-y-2 md:ml-auto">
          <Button variant="primary"
            class="group-[.mode--light]:!bg-white/[0.12] group-[.mode--light]:!text-slate-200 group-[.mode--light]:!border-transparent"
            @click="isConfirmDialogVisible = true">
            <Lucide icon="MessagesSquare" class="stroke-[1.3] w-4 h-4 mr-2" />
            Create a New Ticket
          </Button>

        </div>
      </div>
      <div class="mt-3.5 flex flex-col lg:flex-row gap-y-10 gap-x-6">
        <div class="w-full lg:w-[23rem] flex-none">
          <Tab.Group class="flex flex-col gap-y-7">
            <div class="flex flex-col p-2 box box--stacked">
              <Tab.List variant="boxed-tabs" class="bg-transparent border-transparent">
                <Tab
                  class="first:rounded-l-[0.6rem] last:rounded-r-[0.6rem] [&[aria-selected='true']_button]:text-current [&[aria-selected='true']_button]:text-primary [&[aria-selected='true']_button]:font-medium [&[aria-selected='true']_button]:shadow-sm [&[aria-selected='true']_button]:bg-primary/[0.04] [&[aria-selected='true']_button]:border-primary/[0.15]">
                  <Tab.Button
                    class="w-full text-slate-500 whitespace-nowrap rounded-[0.6rem] py-3 flex items-center gap-2 justify-center"
                    as="button">
                    <Lucide icon="MessagesSquare" class="w-4 h-4 stroke-[1.4]" />
                    Tickets
                    <!-- <div class="min-w-[1.15rem] rounded-full bg-white flex items-center justify-center text-xs">
                      <div class="w-full h-full px-1.5 py-0.5 leading-none rounded-full bg-theme-1/[0.75] text-white">
                        {{ _.random(5, 15) }}
                      </div>
                    </div> -->
                  </Tab.Button>
                </Tab>
                <Tab
                  class="first:rounded-l-[0.6rem] last:rounded-r-[0.6rem] [&[aria-selected='true']_button]:text-current [&[aria-selected='true']_button]:text-primary [&[aria-selected='true']_button]:font-medium [&[aria-selected='true']_button]:shadow-sm [&[aria-selected='true']_button]:bg-primary/[0.04] [&[aria-selected='true']_button]:border-primary/[0.15]">
                  <Tab.Button
                    class="w-full text-slate-500 whitespace-nowrap rounded-[0.6rem] py-3 flex items-center gap-2 justify-center"
                    as="button">
                    <Lucide icon="UserPlus" class="w-4 h-4 stroke-[1.4]" />
                    Contacts
                  </Tab.Button>
                </Tab>
              </Tab.List>
            </div>
            <div class="flex flex-col p-5 box box--stacked">
              <Tab.Panels>
                <Tab.Panel>
                  <div class="">
                    <div class="relative">
                      <Lucide icon="Search"
                        class="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-4 stroke-[1.3] text-slate-500/90" />
                      <FormInput type="text" rounded placeholder="Search for messages..." class="pl-10 py-2.5" />
                    </div>
                    <div class="flex flex-col gap-1 mt-4">
                      <template v-for="ticket in ticketList" :key="ticket.ticket_id">
                        <div @click="fetchTicketData(ticket.ticket_id)"
                          class="flex items-center gap-4 px-2 py-2.5 -mx-2 rounded-lg cursor-pointer hover:bg-slate-50">

                          <div class="w-full">
                            <div class="flex items-center w-full">

                              <div class="font-medium max-w-[7rem] md:max-w-[8rem] truncate">
                                {{ ticket.subject }}
                              </div>

                              <div class="flex items-center gap-2 ml-auto">
                                <template v-if="_.random(0, 1) == 0">
                                  <Lucide icon="CheckCheck" class="w-3.5 h-3.5 stroke-[1.4] text-slate-500/90" />
                                </template>
                                <div class="text-xs text-slate-500/90">

                                  {{ ticket.last_updated }}
                                </div>
                              </div>
                            </div>
                            <div class="flex items-center mt-1.5">
                              <div class="text-slate-500/90 max-w-[7rem] md:max-w-[10rem] truncate">
                                Status: {{ ticket.status }}
                              </div>
                              <div class="flex items-center gap-2 ml-auto">
                                <template v-if="_.random(0, 2) == 0">
                                  <div
                                    class="min-w-[1.15rem] rounded-full bg-white flex items-center justify-center text-xs">
                                    <div
                                      class="w-full h-full px-1.5 py-0.5 leading-none rounded-full bg-theme-1/[0.75] text-white">
                                      {{ _.random(1, 5) }}
                                    </div>
                                  </div>
                                </template>
                                <template v-if="_.random(0, 1) == 0">
                                  <Lucide icon="Pin"
                                    class="w-3.5 h-3.5 stroke-[1] text-slate-500 fill-slate-500/10 rotate-45" />
                                </template>
                              </div>
                            </div>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </div>
          </Tab.Group>
        </div>
        <div class="flex flex-col w-full gap-y-7">
          <div class="flex flex-col p-5 box box--stacked">
            <div class="flex items-center gap-3.5 border-b border-dashed pb-5">

              <div>
                <div class="font-medium truncate max-w-[9rem] md:max-w-none">
                  {{ ticketDetails.category }}
                </div>
                <div class="text-slate-500 mt-0.5 truncate max-w-[9rem] md:max-w-none">
                  {{ ticketDetails.created_at }}
                </div>
              </div>
              <div class="flex gap-2 ml-auto">

                <Tippy as="a"
                  class="flex items-center justify-center border rounded-full w-9 h-9 border-primary/30 bg-primary/5"
                  content="Send a message">
                  <Lucide icon="Mail" class="w-4 h-4 text-primary fill-primary/10" />
                </Tippy>
              </div>
            </div>
            <div :class="[
              'h-[46.6rem] -mx-3 overflow-y-auto [&:-webkit-scrollbar]:w-0 [&:-webkit-scrollbar]:bg-transparent',
              '[&_.simplebar-content]:p-0 [&_.simplebar-track.simplebar-vertical]:w-[10px] [&_.simplebar-track.simplebar-vertical]:mr-0.5 [&_.simplebar-track.simplebar-vertical_.simplebar-scrollbar]:before:bg-slate-400/20',
            ]" ref="scrollableRef">
              <div class="flex flex-col gap-3.5 py-5 px-3">
                <template v-for="message in ticketDetails.ticket_messages" :key="message.message_id">
                  <div :class="[
  'max-w-[85%] sm:max-w-none relative group flex items-end gap-3',
  message.staff_id === null ? 'ml-auto flex-row-reverse' : 'mr-auto'
]">
  <div
    class="border px-4 pt-3 pb-4 rounded-r-xl rounded-tl-xl bg-slate-50/80 
           border-slate-200/80 text-left"
    :class="message.staff_id === null ? 'text-right rounded-l-xl rounded-br-none' : 'rounded-r-xl rounded-tl-xl'"
  >
    <div>{{ message.message }}</div>
  <!-- </div>
</div> -->







                    </div>
                    <Menu
                      class="absolute inset-y-0 right-0 w-5 h-5 my-auto -mr-8 group-[.right]:-ml-8 group-[.right]:left-0">
                      <Menu.Button class="w-5 h-5 text-slate-500">
                        <Lucide icon="MoreVertical" class="w-5 h-5 stroke-slate-400/70 fill-slate-400/70" />
                      </Menu.Button>
                      <Menu.Items class="w-40">
                        <Menu.Item>
                          <Lucide icon="Copy" class="w-4 h-4 mr-2" /> Copy Link
                        </Menu.Item>
                        <Menu.Item>
                          <Lucide icon="Trash" class="w-4 h-4 mr-2" />
                          Delete
                        </Menu.Item>
                      </Menu.Items>
                    </Menu>
                  </div>
                </template>
              </div>
            </div>
            <div class="relative">
              <FormTextarea v-model="message" class="-mb-1.5 pr-16 rounded-xl resize-none"
                placeholder="Type a message..." />
              <div class="absolute inset-y-0 right-0 flex items-center justify-center w-[3.8rem]">
                <a @click="handleSubmit"
                  class="flex items-center justify-center border-transparent rounded-full cursor-pointer w-9 h-9 box bg-gradient-to-b from-theme-1/90 to-theme-2/90">
                  <Lucide icon="Send" class="stroke-[1.3] w-4 h-4 -ml-0.5 text-white/70" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <CreateticketDialog :open="isConfirmDialogVisible" @close="isConfirmDialogVisible = false" />
  <!-- Success Modal -->
  <Dialog :open="successModalPreview" @close="() => (successModalPreview = false)">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <div class="p-5 text-center">
        <Lucide icon="CheckCircle" class="w-16 h-16 mx-auto mt-3 text-success" />
        <div class="mt-5 text-3xl">Good job!</div>
        <div class="mt-2 text-slate-500">
          Messege Send Successfully!
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <Button type="button" variant="primary" @click="handleRefresh" class="w-24">
          Ok
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>

  <!-- Error Modal-->
  <Dialog :open="errorModalVisible" @close="() => (errorModalVisible = false)">
    <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
      <div class="p-5 text-center">
        <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-red-500" />
        <div class="mt-5 text-3xl font-semibold">Oops...</div>
        <div class="mt-2 text-slate-500">
          {{ errorMessage }}
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <Button type="button" variant="primary" @click="handleRefresh" class="w-24">
          Ok
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>
</template>
