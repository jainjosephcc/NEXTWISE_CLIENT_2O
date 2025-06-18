<script setup lang="ts">
import Table from "@/components/Base/Table";
import { defineProps, ref,watch } from "vue";
import Lucide from "@/components/Base/Lucide";
import { format, parseISO } from "date-fns";
import Tippy from "@/components/Base/Tippy";
import { Dialog } from "@/components/Base/Headless";
import {Menu, Popover} from "@/components/Base/Headless";
import apiClient from "../../../services/apiService";
import Button from "@/components/Base/Button";
import FileIcon from "@/components/Base/FileIcon";
import { getS3Image } from '@/utils/S3';

// Reactive reference for image URL
const imageUrls = ref({});
const isLoading = ref(false); // To manage the loading state
const successMessage = ref<string | null>(null); // For success feedback
const errorMessage = ref<string | null>(null); // For error feedback
const errorModalVisible = ref(false);
const successModalPreview = ref(false);
const preview = ref<string | null>(null); // To store the preview URL
const img_base_url = import.meta.env.VITE_S3_BASE;
// Define the base URL for the S3 bucket
const S3_BASE_URL = "pbotcrm/images/userdocs";
//https://s3.ap-south-1.amazonaws.com/crm.paperboat.demo/paperbot/images/userdocs/4/poi/1732399889_1.jpg
// Define props
const props = defineProps({
  clientDocs: {
    type: Array,
    required: true,
  },
});
// Fetch image when component mounts or doc changes



// Function to open the document image in a new tab
const openImage = async (client_id: string, doc_type: string, doc_path: string): Promise<void> => {
  try {
    const s3Key = `${S3_BASE_URL}/${client_id}/${doc_type}/${doc_path}`;
    const imageURL = await getS3Image(s3Key);
    window.open(imageURL, '_blank');
  } catch (error) {
    console.error('Error opening image:', error);
  }
};
// Function to load all images
const loadImageUrls = async () => {
  for (const doc of props.clientDocs) {
    if (doc.extension !== 'pdf') {
      try {
        imageUrls.value[doc.id] = await getImageSrc(doc.client_id, doc.doc_type, doc.doc_path);
      } catch (error) {
        imageUrls.value[doc.id] = ''; // Fallback to empty
      }
    } else {
      imageUrls.value[doc.id] = 'https://i.ibb.co/MB6vHrM/docs.png';
    }
  }
};
watch(() => props.clientDocs, loadImageUrls, { immediate: true });


// Function to get the image source for preview
const getImageSrc = async (client_id: string, doc_type: string, doc_path: string): Promise<string> => {
  try {

    const s3Key = `${S3_BASE_URL}/${client_id}/${doc_type}/${doc_path}`;
    const imageURL = await getS3Image(s3Key);
    console.log("🚀 ~ getImageSrc ~ imageURL:", imageURL)

    return imageURL;
  } catch (error) {
    console.error('Error getting image src:', error);
    return ''; // fallback if image URL generation fails
  }
};


const fileInputRef = ref<HTMLInputElement | null>(null);
  const docId=ref(null)
  const triggerFileInput = (id) => {
    docId.value=id
  if (fileInputRef.value && fileInputRef.value[0]) {
    console.log('hi111');
    
    // Access the first element in the array and trigger the click event
    fileInputRef.value[0].click(); 
    
    console.log('hi...22'); // Trigger the file input click to open the file dialog
  } else {
    console.error("File input reference is not available.");
  }
};

const handleFileChange = async (event: Event) => {
  const target  = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) {
    console.warn("No file selected.");
    return;
  }

  // Validate file type and size
  const allowedTypes = ["image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    errorMessage.value = "Invalid file type. Please upload a JPG or PNG image.";
    errorModalVisible.value = true;
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = "File size exceeds 5MB. Please upload a smaller image.";
    errorModalVisible.value = true;
    return;
  }

  console.log("File selected:", file.name);

  // Perform upload
  try {
    console.log(file);
    
    isLoading.value = true;
    const formData = new FormData();
    formData.append("doc_id", docId.value);
    formData.append("file", file);

    const response = await apiClient.post("/profile/reupload-doc", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200) {
      successMessage.value = "File uploaded successfully!";
      successModalPreview.value = true;

      // preview.value = response.data.user?.profile_pic
      //   ? `${img_base_url}/profileImage/${clientDetails.value.id}/${response.data.user.profile_pic}`
      //   : defaultCoverImage;
      console.log("File uploaded:", response.data);
    } else {
      throw new Error(response.data.message || "Failed to upload the file.");
    }
  } catch (error) {
    console.error("Upload error:", error);
    errorMessage.value = error.response?.data?.message || "Error during file upload. Please try again.";
    errorModalVisible.value = true;
  } finally {
    isLoading.value = false;
  }
};

function handleRefresh() {
  successModalPreview.value = false;
  window.location.reload();
}

</script>

<template>


<div class="max-h-[80vh] overflow-auto px-4 box box--stacked">

   <div class="flex items-center font-medium border-b border-dashed border-slate-300/70 text-[0.94rem]">

                   <span class="mx-3 my-3 mt-7"> {{ $t('viewIdentityComponent.uploadedDocuments') }}</span>
                 <!-- </span> -->
     </div>

<!-- {{ clientDocs }} -->



     <div class="flex flex-col gap-6 px-5 mt-6 ">
       <div>
         <div
             class="h-4 mt-6 mb-5 text-xs uppercase text-slate-800 relative before:content-[''] before:h-px before:bg-slate-800 before:w-full before:absolute before:inset-y-0 before:my-auto"
         >
                 <span class="flex items-center absolute px-2.5 ml-4 bg-white">
                   <Lucide
                       icon="Clock"
                       class="w-[15px] h-[15px] stroke-[1.7] stroke-slate-900 mr-1.5"
                   />
                   PROOF OF ADDRESS
                 </span>
         </div>
         <div class="grid grid-cols-1 md:grid-cols-2 gap-y-3.5 gap-x-4">
           <template
               v-for="doc in clientDocs"
               :key="doc.id"
           >
             <div v-if="doc.doc_type==='poa'" >
              <div
    class="flex bg-cyan-950 hover:bg-slate-800 flex-col items-start relative px-3 py-2.5 rounded-[0.6rem] border border-slate-200/80 hover:bg-slate-50 cursor-pointer transition sm:px-5 shadow-sm"
>
    <!-- Existing Content -->
    <div class="flex items-center w-full">
        <div class="ml-5">
            <FileIcon
                class="w-11 h-11"
                variant="image"
                 :src="imageUrls[doc.id] || 'https://i.ibb.co/MB6vHrM/docs.png'"
                  @click="openImage(doc.client_id, doc.doc_type, doc.doc_path)"
            
             />
        </div>

        <div class="flex flex-col w-full ml-3 lg:items-center lg:flex-row gap-y-1">
            <a
                href="#"
                class="block font-medium capitalize truncate lg:text-center"
                @click="openImage(doc.client_id, doc.doc_type, doc.doc_path)"
            >
                {{ doc.doc_path }}
            </a>
            <div
                :class="[
                    'ml-1.5 whitespace-nowrap px-2 py-1 rounded text-xs font-medium justify-end text-right',
                    {
                        'bg-green-100 text-green-600': doc.status === 3, // Approved
                        'bg-red-100 text-red-600': doc.status === 2,   // Rejected
                        'bg-yellow-100 text-yellow-600': doc.status !== 2 && doc.status !== 3, // Pending
                    },
                ]"
            >
                {{ doc.status === 3 ? 'Approved' : doc.status === 2 ? 'Rejected' : 'Pending' }}
            </div>
        </div>

        <Menu v-if="doc.status !== 3">
            <Menu.Button as="a" class="block w-5 h-5" href="#">
                <Lucide icon="MoreVertical" class="w-5 h-5 stroke-[1] stroke-slate-400/70 fill-slate-400/70" />
            </Menu.Button>
            <Menu.Items class="w-40">
                <Menu.Item @click="triggerFileInput(doc.id)">
                    <Lucide icon="Upload" class="w-4 h-4 mr-2" />
                    Reupload
                </Menu.Item>
                <input
                    ref="fileInputRef"
                    type="file"
                    accept="image/*"
                    class="opacity-0 absolute pointer-events-none"
                    @change="handleFileChange"
                />
            </Menu.Items>
        </Menu>
    </div>

    <!-- 📦 New Text Inside the Box -->
    <div v-if="doc.status ===2" class="w-full mt-3 px-3 py-2 bg-yellow-100 rounded-md text-sm text-gray-700">
        Rejected Reason: {{ doc.rejected_reason }}
    </div>
</div>

               
             </div>
           </template>
         </div>
       </div>
       <div class="flex flex-col gap-6 mt-6 mb-6">
       <div>
         <div
             class="h-4 mb-5 text-xs uppercase text-slate-800 relative before:content-[''] before:h-px before:bg-slate-800 before:w-full before:absolute before:inset-y-0 before:my-auto"
         >
                 <span class="flex items-center absolute px-2.5 ml-4 bg-white">
                   <Lucide
                       icon="Clock"
                       class="w-[15px] h-[15px] stroke-[1.7] stroke-slate-400/70 mr-1.5"
                   />
                   PROOF OF IDENTITY
                 </span>
         </div>
         <div class="grid grid-cols-1 md:grid-cols-2 gap-y-3.5 gap-x-4">
           <template
               v-for="doc in clientDocs"
               :key="doc.id"
           >
             <div v-if="doc.doc_type==='poi'" >
              <div
    class="flex flex-col items-start relative px-3 py-2.5 rounded-[0.6rem] border border-slate-200/80 bg-cyan-950 hover:bg-slate-800 cursor-pointer transition sm:px-5 shadow-sm"
>
    <!-- Existing Content -->
    <div class="flex items-center w-full">
        <div class="ml-5">
            <FileIcon
                class="w-11 h-11"
                variant="image"
                :src="imageUrls[doc.id] || 'https://i.ibb.co/MB6vHrM/docs.png'"
                @click="openImage(doc.client_id, doc.doc_type, doc.doc_path)"
            />
        </div>

        <div class="flex flex-col w-full ml-3 lg:items-center lg:flex-row gap-y-1">
            <a
                href="#"
                class="block font-medium capitalize truncate lg:text-center"
                @click="openImage(doc.client_id, doc.doc_type, doc.doc_path)"
            >
                {{ doc.doc_path }}
            </a>
            <div
                :class="[
                    'ml-1.5 whitespace-nowrap px-2 py-1 rounded text-xs font-medium justify-end text-right',
                    {
                        'bg-green-100 text-green-600': doc.status === 3, // Approved
                        'bg-red-100 text-red-600': doc.status === 2,   // Rejected
                        'bg-yellow-100 text-yellow-600': doc.status !== 2 && doc.status !== 3, // Pending
                    },
                ]"
            >
                {{ doc.status === 3 ? 'Approved' : doc.status === 2 ? 'Rejected' : 'Pending' }}
            </div>
        </div>

        <Menu v-if="doc.status !== 3">
            <Menu.Button as="a" class="block w-5 h-5" href="#">
                <Lucide icon="MoreVertical" class="w-5 h-5 stroke-[1] stroke-slate-400/70 fill-slate-400/70" />
            </Menu.Button>
            <Menu.Items class="w-40">
                <Menu.Item @click="triggerFileInput(doc.id)">
                    <Lucide icon="Upload" class="w-4 h-4 mr-2" />
                    Reupload
                </Menu.Item>
                <input
                    ref="fileInputRef"
                    type="file"
                    accept="image/*"
                    class="opacity-0 absolute pointer-events-none"
                    @change="handleFileChange"
                />
            </Menu.Items>
        </Menu>
    </div>

    <!-- 📦 New Text Inside the Box -->
    <div v-if="doc.status ===2" class="w-full mt-3 px-3 py-2 bg-yellow-100 rounded-md text-sm text-gray-700">
      Rejected Reason: {{ doc.rejected_reason }}
    </div>
</div>

               
             </div>
           </template>
         </div>
       </div>
       </div>
       
     </div>
   </div>

   <Dialog :open="successModalPreview" @close="() => (successModalPreview = false)">
   <Dialog.Panel class="relative bg-white rounded-lg shadow-lg w-96 p-6">
     <div class="p-5 text-center">
       <Lucide icon="CheckCircle" class="w-16 h-16 mx-auto mt-3 text-success" />
       <div class="mt-5 text-3xl">Good job!</div>
       <div class="mt-2 text-slate-500">
         {{ $t('profilesetting.profilesuccess') }}
       </div>
     </div>
     <div class="px-5 pb-8 text-center">
       <Button type="button" variant="primary" @click="handleRefresh" class="w-24">
         {{ $t('identityVerification.ok') }}
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
         {{ $t('identityVerification.ok') }}
       </Button>
     </div>
   </Dialog.Panel>
 </Dialog>

 



</template>
