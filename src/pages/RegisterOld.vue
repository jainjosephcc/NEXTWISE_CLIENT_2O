<script setup lang="ts">
import { FormCheck, FormInput, FormLabel, FormSelect } from "@/components/Base/Form";
import users from "@/fakers/users";
import Button from "@/components/Base/Button";
import _ from "lodash";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useRouter } from "vue-router";
import { ref, computed, watch, onMounted } from 'vue';
import { register } from "@/services/authService";
import { VueTelInput } from 'vue3-tel-input'
import 'vue3-tel-input/dist/vue3-tel-input.css'
import LoadingIcon from "@/components/Base/LoadingIcon";
import Lucide from "@/components/Base/Lucide";
import Dialog from "@/components/Base/Headless/Dialog/Dialog.vue";
import { fetchCountries } from '@/services/apiService';
import LogoChip from "@/assets/LogoChip.vue";
import AuthSliders from "@/assets/AuthSliders.vue";
import VueTurnstile from "vue-turnstile";

const siteKey = '0x4AAAAAABHsT8LZqahJmnnv'
const turnstile_token = ref('');
const projectName = import.meta.env.VITE_PROJECT_NAME;
const router = useRouter();
declare global {
  interface Window {
    turnstile: any
    onloadTurnstileCallback: () => void
  }
}

const phoneNumber = ref("");
const countryCode = ref('FR');
const results = ref();
const phone = ref("");
const fname = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const referralCode = ref("");
const searchQuery = ref("");
const countries = ref([
  {
    "name": "Afghanistan",
    "id": 1,
    "iso": "af"
  },
  {
    "name": "\u00c5land Islands",
    "id": 2,
    "iso": "ax"
  },
  {
    "name": "Albania",
    "id": 3,
    "iso": "al"
  },
  {
    "name": "Algeria",
    "id": 4,
    "iso": "dz"
  },
  {
    "name": "American Samoa",
    "id": 5,
    "iso": "as"
  },
  {
    "name": "Andorra",
    "id": 6,
    "iso": "ad"
  },
  {
    "name": "Angola",
    "id": 7,
    "iso": "ao"
  },
  {
    "name": "Anguilla",
    "id": 8,
    "iso": "ai"
  },
  {
    "name": "Antarctica",
    "id": 9,
    "iso": "aq"
  },
  {
    "name": "Antigua and Barbuda",
    "id": 10,
    "iso": "ag"
  },
  {
    "name": "Argentina",
    "id": 11,
    "iso": "ar"
  },
  {
    "name": "Armenia",
    "id": 12,
    "iso": "am"
  },
  {
    "name": "Aruba",
    "id": 13,
    "iso": "aw"
  },
  {
    "name": "Australia",
    "id": 14,
    "iso": "au"
  },
  {
    "name": "Austria",
    "id": 15,
    "iso": "at"
  },
  {
    "name": "Azerbaijan",
    "id": 16,
    "iso": "az"
  },
  {
    "name": "Bahamas",
    "id": 17,
    "iso": "bs"
  },
  {
    "name": "Bahrain",
    "id": 18,
    "iso": "bh"
  },
  {
    "name": "Bangladesh",
    "id": 19,
    "iso": "bd"
  },
  {
    "name": "Barbados",
    "id": 20,
    "iso": "bb"
  },
  {
    "name": "Belarus",
    "id": 21,
    "iso": "by"
  },
  {
    "name": "Belgium",
    "id": 22,
    "iso": "be"
  },
  {
    "name": "Belize",
    "id": 23,
    "iso": "bz"
  },
  {
    "name": "Benin",
    "id": 24,
    "iso": "bj"
  },
  {
    "name": "Bermuda",
    "id": 25,
    "iso": "bm"
  },
  {
    "name": "Bhutan",
    "id": 26,
    "iso": "bt"
  },
  {
    "name": "Bolivia (Plurinational State of)",
    "id": 27,
    "iso": "bo"
  },
  {
    "name": "Bonaire",
    "id": 28,
    "iso": "bq"
  },
  {
    "name": "Bosnia and Herzegovina",
    "id": 29,
    "iso": "ba"
  },
  {
    "name": "Botswana",
    "id": 30,
    "iso": "bw"
  },
  {
    "name": "Bouvet Island",
    "id": 31,
    "iso": "bv"
  },
  {
    "name": "Brazil",
    "id": 32,
    "iso": "br"
  },
  {
    "name": "British Indian Ocean Territory",
    "id": 33,
    "iso": "io"
  },
  {
    "name": "Brunei Darussalam",
    "id": 34,
    "iso": "bn"
  },
  {
    "name": "Bulgaria",
    "id": 35,
    "iso": "bg"
  },
  {
    "name": "Burkina Faso",
    "id": 36,
    "iso": "bf"
  },
  {
    "name": "Burundi",
    "id": 37,
    "iso": "bi"
  },
  {
    "name": "Cambodia",
    "id": 38,
    "iso": "kh"
  },
  {
    "name": "Cameroon",
    "id": 39,
    "iso": "cm"
  },
  {
    "name": "Canada",
    "id": 40,
    "iso": "ca"
  },
  {
    "name": "Cabo Verde",
    "id": 41,
    "iso": "cv"
  },
  {
    "name": "Cayman Islands",
    "id": 42,
    "iso": "ky"
  },
  {
    "name": "Central African Republic",
    "id": 43,
    "iso": "cf"
  },
  {
    "name": "Chad",
    "id": 44,
    "iso": "td"
  },
  {
    "name": "Chile",
    "id": 45,
    "iso": "cl"
  },
  {
    "name": "China",
    "id": 46,
    "iso": "cn"
  },
  {
    "name": "Christmas Island",
    "id": 47,
    "iso": "cx"
  },
  {
    "name": "Cocos (Keeling) Islands",
    "id": 48,
    "iso": "cc"
  },
  {
    "name": "Colombia",
    "id": 49,
    "iso": "co"
  },
  {
    "name": "Comoros",
    "id": 50,
    "iso": "km"
  },
  {
    "name": "Congo",
    "id": 51,
    "iso": "cg"
  },
  {
    "name": "Congo (Democratic Republic of the)",
    "id": 52,
    "iso": "cd"
  },
  {
    "name": "Cook Islands",
    "id": 53,
    "iso": "ck"
  },
  {
    "name": "Costa Rica",
    "id": 54,
    "iso": "cr"
  },
  {
    "name": "C\u00f4te d\"Ivoire",
    "id": 55,
    "iso": "ci"
  },
  {
    "name": "Croatia",
    "id": 56,
    "iso": "hr"
  },
  {
    "name": "Cuba",
    "id": 57,
    "iso": "cu"
  },
  {
    "name": "Cura\u00e7ao",
    "id": 58,
    "iso": "cw"
  },
  {
    "name": "Cyprus",
    "id": 59,
    "iso": "cy"
  },
  {
    "name": "Czechia",
    "id": 60,
    "iso": "cz"
  },
  {
    "name": "Denmark",
    "id": 61,
    "iso": "dk"
  },
  {
    "name": "Djibouti",
    "id": 62,
    "iso": "dj"
  },
  {
    "name": "Dominica",
    "id": 63,
    "iso": "dm"
  },
  {
    "name": "Dominican Republic",
    "id": 64,
    "iso": "do"
  },
  {
    "name": "Ecuador",
    "id": 65,
    "iso": "ec"
  },
  {
    "name": "Egypt",
    "id": 66,
    "iso": "eg"
  },
  {
    "name": "El Salvador",
    "id": 67,
    "iso": "sv"
  },
  {
    "name": "Equatorial Guinea",
    "id": 68,
    "iso": "gq"
  },
  {
    "name": "Eritrea",
    "id": 69,
    "iso": "er"
  },
  {
    "name": "Estonia",
    "id": 70,
    "iso": "ee"
  },
  {
    "name": "Ethiopia",
    "id": 71,
    "iso": "et"
  },
  {
    "name": "Falkland Islands (Malvinas)",
    "id": 72,
    "iso": "fk"
  },
  {
    "name": "Faroe Islands",
    "id": 73,
    "iso": "fo"
  },
  {
    "name": "Fiji",
    "id": 74,
    "iso": "fj"
  },
  {
    "name": "Finland",
    "id": 75,
    "iso": "fi"
  },
  {
    "name": "France",
    "id": 76,
    "iso": "fr"
  },
  {
    "name": "French Guiana",
    "id": 77,
    "iso": "gf"
  },
  {
    "name": "French Polynesia",
    "id": 78,
    "iso": "pf"
  },
  {
    "name": "French Southern Territories",
    "id": 79,
    "iso": "tf"
  },
  {
    "name": "Gabon",
    "id": 80,
    "iso": "ga"
  },
  {
    "name": "Gambia",
    "id": 81,
    "iso": "gm"
  },
  {
    "name": "Georgia",
    "id": 82,
    "iso": "ge"
  },
  {
    "name": "Germany",
    "id": 83,
    "iso": "de"
  },
  {
    "name": "Ghana",
    "id": 84,
    "iso": "gh"
  },
  {
    "name": "Gibraltar",
    "id": 85,
    "iso": "gi"
  },
  {
    "name": "Greece",
    "id": 86,
    "iso": "gr"
  },
  {
    "name": "Greenland",
    "id": 87,
    "iso": "gl"
  },
  {
    "name": "Grenada",
    "id": 88,
    "iso": "gd"
  },
  {
    "name": "Guadeloupe",
    "id": 89,
    "iso": "gp"
  },
  {
    "name": "Guam",
    "id": 90,
    "iso": "gu"
  },
  {
    "name": "Guatemala",
    "id": 91,
    "iso": "gt"
  },
  {
    "name": "Guernsey",
    "id": 92,
    "iso": "gg"
  },
  {
    "name": "Guinea",
    "id": 93,
    "iso": "gn"
  },
  {
    "name": "Guinea-Bissau",
    "id": 94,
    "iso": "gw"
  },
  {
    "name": "Guyana",
    "id": 95,
    "iso": "gy"
  },
  {
    "name": "Haiti",
    "id": 96,
    "iso": "ht"
  },
  {
    "name": "Heard Island and McDonald Islands",
    "id": 97,
    "iso": "hm"
  },
  {
    "name": "Holy See",
    "id": 98,
    "iso": "va"
  },
  {
    "name": "Honduras",
    "id": 99,
    "iso": "hn"
  },
  {
    "name": "Hong Kong",
    "id": 100,
    "iso": "hk"
  },
  {
    "name": "Hungary",
    "id": 101,
    "iso": "hu"
  },
  {
    "name": "Iceland",
    "id": 102,
    "iso": "is"
  },
  {
    "name": "India",
    "id": 103,
    "iso": "in"
  },
  {
    "name": "Indonesia",
    "id": 104,
    "iso": "id"
  },
  {
    "name": "Iran (Islamic Republic of)",
    "id": 105,
    "iso": "ir"
  },
  {
    "name": "Iraq",
    "id": 106,
    "iso": "iq"
  },
  {
    "name": "Ireland",
    "id": 107,
    "iso": "ie"
  },
  {
    "name": "Isle of Man",
    "id": 108,
    "iso": "im"
  },
  {
    "name": "Israel",
    "id": 109,
    "iso": "il"
  },
  {
    "name": "Italy",
    "id": 110,
    "iso": "it"
  },
  {
    "name": "Jamaica",
    "id": 111,
    "iso": "jm"
  },
  {
    "name": "Japan",
    "id": 112,
    "iso": "jp"
  },
  {
    "name": "Jersey",
    "id": 113,
    "iso": "je"
  },
  {
    "name": "Jordan",
    "id": 114,
    "iso": "jo"
  },
  {
    "name": "Kazakhstan",
    "id": 115,
    "iso": "kz"
  },
  {
    "name": "Kenya",
    "id": 116,
    "iso": "ke"
  },
  {
    "name": "Kiribati",
    "id": 117,
    "iso": "ki"
  },
  {
    "name": "Korea (Democratic People\"s Republic of)",
    "id": 118,
    "iso": "kp"
  },
  {
    "name": "Korea (Republic of)",
    "id": 119,
    "iso": "kr"
  },
  {
    "name": "Kuwait",
    "id": 120,
    "iso": "kw"
  },
  {
    "name": "Kyrgyzstan",
    "id": 121,
    "iso": "kg"
  },
  {
    "name": "Lao People\"s Democratic Republic",
    "id": 122,
    "iso": "la"
  },
  {
    "name": "Latvia",
    "id": 123,
    "iso": "lv"
  },
  {
    "name": "Lebanon",
    "id": 124,
    "iso": "lb"
  },
  {
    "name": "Lesotho",
    "id": 125,
    "iso": "ls"
  },
  {
    "name": "Liberia",
    "id": 126,
    "iso": "lr"
  },
  {
    "name": "Libya",
    "id": 127,
    "iso": "ly"
  },
  {
    "name": "Liechtenstein",
    "id": 128,
    "iso": "li"
  },
  {
    "name": "Lithuania",
    "id": 129,
    "iso": "lt"
  },
  {
    "name": "Luxembourg",
    "id": 130,
    "iso": "lu"
  },
  {
    "name": "Macao",
    "id": 131,
    "iso": "mo"
  },
  {
    "name": "Macedonia (the former Yugoslav Republic of)",
    "id": 132,
    "iso": "mk"
  },
  {
    "name": "Madagascar",
    "id": 133,
    "iso": "mg"
  },
  {
    "name": "Malawi",
    "id": 134,
    "iso": "mw"
  },
  {
    "name": "Malaysia",
    "id": 135,
    "iso": "my"
  },
  {
    "name": "Maldives",
    "id": 136,
    "iso": "mv"
  },
  {
    "name": "Mali",
    "id": 137,
    "iso": "ml"
  },
  {
    "name": "Malta",
    "id": 138,
    "iso": "mt"
  },
  {
    "name": "Marshall Islands",
    "id": 139,
    "iso": "mh"
  },
  {
    "name": "Martinique",
    "id": 140,
    "iso": "mq"
  },
  {
    "name": "Mauritania",
    "id": 141,
    "iso": "mr"
  },
  {
    "name": "Mauritius",
    "id": 142,
    "iso": "mu"
  },
  {
    "name": "Mayotte",
    "id": 143,
    "iso": "yt"
  },
  {
    "name": "Mexico",
    "id": 144,
    "iso": "mx"
  },
  {
    "name": "Micronesia (Federated States of)",
    "id": 145,
    "iso": "fm"
  },
  {
    "name": "Morocco",
    "id": 146,
    "iso": "ma"
  },
  {
    "name": "Moldova (Republic of)",
    "id": 147,
    "iso": "md"
  },
  {
    "name": "Monaco",
    "id": 148,
    "iso": "mc"
  },
  {
    "name": "Mongolia",
    "id": 149,
    "iso": "mn"
  },
  {
    "name": "Montenegro",
    "id": 150,
    "iso": "me"
  },
  {
    "name": "Montserrat",
    "id": 151,
    "iso": "ms"
  },
  {
    "name": "Mozambique",
    "id": 152,
    "iso": "mz"
  },
  {
    "name": "Myanmar",
    "id": 153,
    "iso": "mm"
  },
  {
    "name": "Namibia",
    "id": 154,
    "iso": "na"
  },
  {
    "name": "Nauru",
    "id": 155,
    "iso": "nr"
  },
  {
    "name": "Nepal",
    "id": 156,
    "iso": "np"
  },
  {
    "name": "Netherlands",
    "id": 157,
    "iso": "nl"
  },
  {
    "name": "New Caledonia",
    "id": 158,
    "iso": "nc"
  },
  {
    "name": "New Zealand",
    "id": 159,
    "iso": "nz"
  },
  {
    "name": "Nicaragua",
    "id": 160,
    "iso": "ni"
  },
  {
    "name": "Niger",
    "id": 161,
    "iso": "ne"
  },
  {
    "name": "Nigeria",
    "id": 162,
    "iso": "ng"
  },
  {
    "name": "Niue",
    "id": 163,
    "iso": "nu"
  },
  {
    "name": "Norfolk Island",
    "id": 164,
    "iso": "nf"
  },
  {
    "name": "Northern Mariana Islands",
    "id": 165,
    "iso": "mp"
  },
  {
    "name": "Norway",
    "id": 166,
    "iso": "no"
  },
  {
    "name": "Oman",
    "id": 167,
    "iso": "om"
  },
  {
    "name": "Pakistan",
    "id": 168,
    "iso": "pk"
  },
  {
    "name": "Palau",
    "id": 169,
    "iso": "pw"
  },
  {
    "name": "Palestine",
    "id": 170,
    "iso": "ps"
  },
  {
    "name": "Panama",
    "id": 171,
    "iso": "pa"
  },
  {
    "name": "Papua New Guinea",
    "id": 172,
    "iso": "pg"
  },
  {
    "name": "Paraguay",
    "id": 173,
    "iso": "py"
  },
  {
    "name": "Peru",
    "id": 174,
    "iso": "pe"
  },
  {
    "name": "Philippines",
    "id": 175,
    "iso": "ph"
  },
  {
    "name": "Pitcairn",
    "id": 176,
    "iso": "pn"
  },
  {
    "name": "Poland",
    "id": 177,
    "iso": "pl"
  },
  {
    "name": "Portugal",
    "id": 178,
    "iso": "pt"
  },
  {
    "name": "Puerto Rico",
    "id": 179,
    "iso": "pr"
  },
  {
    "name": "Qatar",
    "id": 180,
    "iso": "qa"
  },
  {
    "name": "R\u00e9union",
    "id": 181,
    "iso": "re"
  },
  {
    "name": "Romania",
    "id": 182,
    "iso": "ro"
  },
  {
    "name": "Russian Federation",
    "id": 183,
    "iso": "ru"
  },
  {
    "name": "Rwanda",
    "id": 184,
    "iso": "rw"
  },
  {
    "name": "Saint Barth\u00e9lemy",
    "id": 185,
    "iso": "bl"
  },
  {
    "name": "Saint Helena",
    "id": 186,
    "iso": " ?"
  },
  {
    "name": "Saint Kitts and Nevis",
    "id": 187,
    "iso": "kn"
  },
  {
    "name": "Saint Lucia",
    "id": 188,
    "iso": "lc"
  },
  {
    "name": "Saint Martin (French part)",
    "id": 189,
    "iso": "mf"
  },
  {
    "name": "Saint Pierre and Miquelon",
    "id": 190,
    "iso": "pm"
  },
  {
    "name": "Saint Vincent and the Grenadines",
    "id": 191,
    "iso": "vc"
  },
  {
    "name": "Samoa",
    "id": 192,
    "iso": "ws"
  },
  {
    "name": "San Marino",
    "id": 193,
    "iso": "sm"
  },
  {
    "name": "Sao Tome and Principe",
    "id": 194,
    "iso": "st"
  },
  {
    "name": "Saudi Arabia",
    "id": 195,
    "iso": "sa"
  },
  {
    "name": "Senegal",
    "id": 196,
    "iso": "sn"
  },
  {
    "name": "Serbia",
    "id": 197,
    "iso": "rs"
  },
  {
    "name": "Seychelles",
    "id": 198,
    "iso": "sc"
  },
  {
    "name": "Sierra Leone",
    "id": 199,
    "iso": "sl"
  },
  {
    "name": "Singapore",
    "id": 200,
    "iso": "sg"
  },
  {
    "name": "Sint Maarten (Dutch part)",
    "id": 201,
    "iso": "sx"
  },
  {
    "name": "Slovakia",
    "id": 202,
    "iso": "sk"
  },
  {
    "name": "Slovenia",
    "id": 203,
    "iso": "si"
  },
  {
    "name": "Solomon Islands",
    "id": 204,
    "iso": "sb"
  },
  {
    "name": "Somalia",
    "id": 205,
    "iso": "so"
  },
  {
    "name": "South Africa",
    "id": 206,
    "iso": "za"
  },
  {
    "name": "South Georgia and the South Sandwich Islands",
    "id": 207,
    "iso": "gs"
  },
  {
    "name": "South Sudan",
    "id": 208,
    "iso": "ss"
  },
  {
    "name": "Spain",
    "id": 209,
    "iso": "es"
  },
  {
    "name": "Sri Lanka",
    "id": 210,
    "iso": "lk"
  },
  {
    "name": "Sudan",
    "id": 211,
    "iso": "sd"
  },
  {
    "name": "Suriname",
    "id": 212,
    "iso": "sr"
  },
  {
    "name": "Svalbard and Jan Mayen",
    "id": 213,
    "iso": "sj"
  },
  {
    "name": "Eswatini",
    "id": 214,
    "iso": "sz"
  },
  {
    "name": "Sweden",
    "id": 215,
    "iso": "se"
  },
  {
    "name": "Switzerland",
    "id": 216,
    "iso": "ch"
  },
  {
    "name": "Syrian Arab Republic",
    "id": 217,
    "iso": "sy"
  },
  {
    "name": "Taiwan",
    "id": 218,
    "iso": "tw"
  },
  {
    "name": "Tajikistan",
    "id": 219,
    "iso": "tj"
  },
  {
    "name": "Tanzania",
    "id": 220,
    "iso": "tz"
  },
  {
    "name": "Thailand",
    "id": 221,
    "iso": "th"
  },
  {
    "name": "Timor-Leste",
    "id": 222,
    "iso": "tl"
  },
  {
    "name": "Togo",
    "id": 223,
    "iso": "tg"
  },
  {
    "name": "Tokelau",
    "id": 224,
    "iso": "tk"
  },
  {
    "name": "Tonga",
    "id": 225,
    "iso": "to"
  },
  {
    "name": "Trinidad and Tobago",
    "id": 226,
    "iso": "tt"
  },
  {
    "name": "Tunisia",
    "id": 227,
    "iso": "tn"
  },
  {
    "name": "Turkey",
    "id": 228,
    "iso": "tr"
  },
  {
    "name": "Turkmenistan",
    "id": 229,
    "iso": "tm"
  },
  {
    "name": "Turks and Caicos Islands",
    "id": 230,
    "iso": "tc"
  },
  {
    "name": "Tuvalu",
    "id": 231,
    "iso": "tv"
  },
  {
    "name": "Uganda",
    "id": 232,
    "iso": "ug"
  },
  {
    "name": "Ukraine",
    "id": 233,
    "iso": "ua"
  },
  {
    "name": "United Arab Emirates",
    "id": 234,
    "iso": "ae"
  },
  {
    "name": "United Kingdom of Great Britain and Northern Ireland",
    "id": 235,
    "iso": "gb"
  },
  {
    "name": "United States of America",
    "id": 236,
    "iso": "us"
  },
  {
    "name": "United States Minor Outlying Islands",
    "id": 237,
    "iso": "um"
  },
  {
    "name": "Uruguay",
    "id": 238,
    "iso": "uy"
  },
  {
    "name": "Uzbekistan",
    "id": 239,
    "iso": "uz"
  },
  {
    "name": "Vanuatu",
    "id": 240,
    "iso": "vu"
  },
  {
    "name": "Venezuela (Bolivarian Republic of)",
    "id": 241,
    "iso": "ve"
  },
  {
    "name": "Viet Nam",
    "id": 242,
    "iso": "vn"
  },
  {
    "name": "Virgin Islands (British)",
    "id": 243,
    "iso": "vg"
  },
  {
    "name": "Virgin Islands (U.S.)",
    "id": 244,
    "iso": "vi"
  },
  {
    "name": "Wallis and Futuna",
    "id": 245,
    "iso": "wf"
  },
  {
    "name": "Western Sahara",
    "id": 246,
    "iso": "eh"
  },
  {
    "name": "Yemen",
    "id": 247,
    "iso": "ye"
  },
  {
    "name": "Zambia",
    "id": 248,
    "iso": "zm"
  },
  {
    "name": "Zimbabwe",
    "id": 249,
    "iso": "zw"
  }
]);
const selectedCountry = ref("");
const promoCode = ref("");
const errors = ref({
  fname: "",
  lname: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  agree: "",
  country: "",
  promoCode: "",
});
const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
const showPassword2 = ref(false);

const togglePasswordVisibility2 = () => {
  showPassword2.value = !showPassword2.value;
};
const isAgreeChecked = ref(false);
const isLoading = ref(false);
const showOTPForm = ref(true);
const warningModalPreview = ref(false);
const dialogMessage = ref("Something went wrong!");
const promocodeDisable = ref(false)

onMounted(async () => {
  const url = new URL(window.location.href);
  // Get the promo parameter value
  const promo = url.searchParams.get('promo');

  // Set the promocode value
  if (promo) {
    promocodeDisable.value = true
    promoCode.value = promo;
  }

  /* try {
    countries.value = await fetchCountries();
  } catch (error) {
    console.error("Failed to fetch countries:", error);
  }
    */
});

const filteredCountries = computed(() =>
  countries.value.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);


const selectCountry = (name) => {
  selectedCountry.value = name;
  searchQuery.value = name;
};


// Function to handle modal close
const closeModal = () => {
  warningModalPreview.value = false;
};
const navigateToLogin = () => {
  router.push('/login');
};


const updatePhone = (event: any) => {
  // If the event is a string, assign it directly to phone.value
  if (typeof event === 'string') {
    phone.value = event;
  }
  // If the event is an object and has a valid target value, assign it accordingly
  else if (event && event.target && typeof event.target.value === 'string') {
    phone.value = event.target.value;
  } else {
    // If no valid value is found, reset phone.value to an empty string
    console.error("Invalid phone value received, resetting to an empty string.");
    phone.value = "";
  }
};


const conditions = [
  { valid: false, message: "Minimum 8 characters", regex: /.{8,}/ },
  { valid: false, message: "At least 1 uppercase letter", regex: /[A-Z]/ },
  { valid: false, message: "At least 1 lowercase letter", regex: /[a-z]/ },
  { valid: false, message: "At least 1 special character", regex: /[@$!%*#?&]/ },
  { valid: false, message: "At least 1 digit", regex: /[0-9]/ },
];

const passwordStrength = computed(() => {
  let strength = 0;

  // Update each condition's validity
  conditions.forEach(condition => {
    condition.valid = condition.regex.test(password.value);
    if (condition.valid) strength += 1;
  });

  return strength;
});
// Validation function for all inputs
const validateFields = () => {
  let valid = true;

  if (!fname.value) {
    errors.value.fname = "First name is required";
    valid = false;
  } else {
    errors.value.fname = "";
  }


  if (!selectedCountry.value) {
    errors.value.country = "Country is required";
    valid = false;
  } else {
    errors.value.country = "";
  }

  if (!email.value) {
    errors.value.email = "Email is required";
    valid = false;
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    errors.value.email = "Invalid email format";
    valid = false;
  } else {
    errors.value.email = "";
  }

  if (!phone.value) {
    errors.value.phone = "Phone number is required";
    valid = false;
  } else {
    errors.value.phone = "";
  }
  if (!password.value) {
    errors.value.password = "Password is required";
    valid = false;
  } else {
    const failingConditions = conditions.filter(condition => !condition.valid);

    if (failingConditions.length > 0) {
      // Show the first failing condition's message
      errors.value.password = failingConditions[0].message;
      valid = false;
    } else if (passwordStrength.value === 1) {
      errors.value.password = "Password is too weak";
      valid = false;
    } else {
      errors.value.password = "";
    }
  }

  if (confirmPassword.value !== password.value) {
    errors.value.confirmPassword = "Passwords do not match";
    valid = false;
  } else {
    errors.value.confirmPassword = "";
  }

  if (!isAgreeChecked.value) {
    errors.value.agree = "You must agree to the privacy policy";
    valid = false;
  } else {
    errors.value.agree = "";
  }

  return valid;
};

const registerUser = async () => {
  isLoading.value = true;
  warningModalPreview.value = false; // Reset warning modal state
  dialogMessage.value = "Something went wrong!"; // Reset message to default


  if (!validateFields()) {
    isLoading.value = false;
    return;
  }
  if (!turnstile_token.value) {
    alert('Please complete the CAPTCHA!');
    return;
  }

  try {
    const userData = {
      fname: fname.value,
      email_id: email.value,
      password: password.value,
      phone_number: phone.value,
      nationality: selectedCountry.value,
      client_entity: 1, // You can customize as per requirement
      is_email_verified: false, // Initial email verification
      is_corporate: false,
      referal_code: promoCode.value,
      turnstile_token: turnstile_token.value,
    };

    const response = await register(userData);
    //console.log('Registration successful:', response);
    router.push("/verify-email");
    isLoading.value = false;
  } catch (error) {
    isLoading.value = false;

    // Check for response status 400 or other specific cases
    if (error.response?.status === 400 && error.response?.data?.message) {
      dialogMessage.value = error.response.data.message; // Set the API message
    }
    warningModalPreview.value = true;
  }
};


</script>

<template>
  <div
    class="container grid lg:h-screen grid-cols-12 lg:max-w-[1550px] 2xl:max-w-[1750px] py-10 px-5 sm:py-14 sm:px-10 md:px-36 lg:py-0 lg:pl-14 lg:pr-12 xl:px-24">
    <div :class="[
      'relative z-50 h-full col-span-12 p-7 sm:p-14 bg-white rounded-2xl lg:bg-transparent lg:pr-10 lg:col-span-5 xl:pr-24 2xl:col-span-4 lg:p-0',
      'before:content-[\'\'] before:absolute before:inset-0 before:-mb-3.5 before:bg-white/40 before:rounded-2xl before:mx-5',
    ]">
      <div class="relative z-10 flex flex-col justify-center w-full h-full lg:py-4">
        <LogoChip />
        <div class="mt-4">
          <div class="text-2xl font-medium">Sign Up</div>
          <div class="mt-1 text-xs text-slate-600">
            Already have an account?
            <a class="font-medium text-xs text-primary" href="/login"> Sign In </a>
          </div>
          <div class="mt-6">
            <FormLabel class="text-xs">Full Name*</FormLabel>
            <FormInput v-model="fname" type="text" class="block px-4 py-2.5 rounded-[0.6rem] border-slate-300/80"
              :placeholder="users.fakeUsers()[0].name.split(' ')[0]" />
            <div class="text-red-500 text-xs">{{ errors.fname }}</div>

            <FormLabel class="mt-5 text-xs">Email*</FormLabel>
            <FormInput v-model="email" type="text" class="block px-4 py-2.5 rounded-[0.6rem] border-slate-300/80" />
            <div class="text-red-500 text-xs">{{ errors.email }}</div>

            <div class="mt-5 text-xs">
              <FormLabel for="country" class="">Nationality*</FormLabel>
              <div class="relative">
                <FormSelect v-model="selectedCountry" id="country"
                  class="block px-4 py-2.5 rounded-[0.6rem] border-slate-300/80">
                  <option value="" disabled>Select a country</option>
                  <option v-for="country in countries" :key="country.id" :value="country.id">
                    {{ country.name }}
                  </option>

                </FormSelect>
                <div class="text-red-500 text-xs">{{ errors.country }}</div>
              </div>
            </div>


            <FormLabel class="mt-5 text-xs">Phone Number*</FormLabel>

            <vue-tel-input :value="phone" @input="updatePhone" mode="international" class="block px-4"
              style="border-radius: 10px; border-color: #cbd5e1cc;">
            </vue-tel-input>
            <div class="text-red-500 text-xs">{{ errors.phone }}</div>



            <FormLabel class="mt-5 text-xs">Password*</FormLabel>
            <div class="relative">
              <FormInput v-model="password" :type="showPassword ? 'text' : 'password'"
                class="block w-full px-4 py-3.5 rounded-[0.6rem] border-slate-300/80" placeholder="************" />
              <!-- Lucide Icon -->
              <span class="absolute inset-y-0 right-4 flex items-center cursor-pointer"
                @click="togglePasswordVisibility">
                <Lucide :icon="showPassword ? 'EyeOff' : 'Eye'" class="stroke-[0.8] w-5 h-5 text-gray-500" />

              </span>
            </div>
            <div class="grid w-full h-1.5 grid-cols-12 gap-4 mt-3.5">
              <div :class="passwordStrength > 0 ? 'active' : ''"
                class="h-full col-span-3 border rounded bg-slate-400/30 border-slate-400/20 [&.active]:bg-theme-1/30 [&.active]:border-theme-1/20">
              </div>
              <div :class="passwordStrength >= 2 ? 'active' : ''"
                class="h-full col-span-3 border rounded bg-slate-400/30 border-slate-400/20 [&.active]:bg-theme-1/30 [&.active]:border-theme-1/20">
              </div>
              <div :class="passwordStrength >= 3 ? 'active' : ''"
                class="h-full col-span-3 border rounded bg-slate-400/30 border-slate-400/20 [&.active]:bg-theme-1/30 [&.active]:border-theme-1/20">
              </div>
              <div :class="passwordStrength >= 4 ? 'active' : ''"
                class="h-full col-span-3 border rounded bg-slate-400/30 border-slate-400/20 [&.active]:bg-theme-1/30 [&.active]:border-theme-1/20">
              </div>
            </div>
            <!--            <div class="mt-2 text-xs">Password Strength: {{ passwordStrength }}</div>-->
            <div class="text-red-500 text-xs">{{ errors.password }}</div>

            <FormLabel class="mt-5 text-xs">Confirm Password*</FormLabel>
            <div class="relative">
              <FormInput v-model="confirmPassword" :type="showPassword2 ? 'text' : 'password'"
                class="block px-4 py-2.5 rounded-[0.6rem] border-slate-300/80" placeholder="************" />
              <span class="absolute inset-y-0 right-4 flex items-center cursor-pointer"
                @click="togglePasswordVisibility2">
                <Lucide :icon="showPassword2 ? 'EyeOff' : 'Eye'" class="stroke-[0.8] w-5 h-5 text-gray-500" />

              </span>
            </div>
            <div class="text-red-500 text-xs">{{ errors.confirmPassword }}</div>

            <FormLabel class="mt-5 text-xs">Referral Code (if any)</FormLabel>
            <FormInput v-model="promoCode" type="text" class="block px-4 py-2.5 rounded-[0.6rem] border-slate-300/80"
              placeholder="Referral Code" :disabled="promocodeDisable" />
            <div class="text-red-500 text-xs">{{ errors.promoCode }}</div>

            <div class="flex items-center mt-5 text-xs text-slate-500 sm:text-sm">
              <FormCheck.Input id="remember-me" v-model="isAgreeChecked" type="checkbox" class="mr-2 border" />
              <label class="cursor-pointer select-none" htmlFor="remember-me">
                I agree to the {{ projectName }} <a class="ml-1 text-primary dark:text-slate-200"
                  href="../RiskDisclosurebulge.pdf"
                  target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>,
                <a class="ml-1 text-primary dark:text-slate-200"
                  href="../RiskDisclosurebulge.pdf"
                  target="_blank" rel="noopener noreferrer">
                  Terms and Conditions
                </a>, and
                <a class="ml-1 text-primary dark:text-slate-200"
   href="../RiskDisclosurebulge.pdf"
   target="_blank" rel="noopener noreferrer">
   Risk Disclosure
</a>.
              </label>
            </div>
            <div class="text-red-500 text-xs">{{ errors.agree }}</div>

            <div class="w-full flex justify-center mt-4 overflow-x-auto max-w-full md:overflow-x-hidden">
              <div class="min-w-[280px] w-full max-w-[300px]">
                <vue-turnstile class="mt-4" :site-key="siteKey" v-model="turnstile_token" />
              </div>
            </div>

            <div class="mt-5 text-center xl:mt-8 xl:text-left">
              <Button :disabled="isLoading" variant="primary" rounded
                class="bg-gradient-to-r from-theme-1/70 to-theme-2/70 w-full py-3.5 xl:mr-3" @click="registerUser">
                <template v-if="isLoading">
                  Saving
                  <LoadingIcon icon="oval" color="white" class="w-4 h-4 ml-2" />
                </template>
                <template v-else>
                  Sign Up
                </template>
              </Button>
              <Button variant="outline-secondary" rounded @click="navigateToLogin"
                class="bg-white/70 w-full py-3.5 mt-3">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <AuthSliders />

  <Dialog :open="warningModalPreview" @close="closeModal">
    <Dialog.Panel>
      <div class="p-5 text-center">
        <Lucide icon="XCircle" class="w-16 h-16 mx-auto mt-3 text-warning" />
        <div class="mt-5 text-3xl">Oops...</div>
        <div class="mt-2 text-slate-500">
          Something went wrong!
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <Button type="button" variant="primary" @click="closeModal" class="w-24">
          Ok
        </Button>
      </div>
      <div class="p-5 text-center border-t border-slate-200/60 dark:border-darkmode-400">
        <span class="text-warning">
          {{ dialogMessage }}
        </span>
      </div>
    </Dialog.Panel>
  </Dialog>


  <ThemeSwitcher />
</template>
<style scoped>
/* Optionally add some CSS to adjust input width and alignment */
.text-center {
  text-align: center;
}

.w-12 {
  width: 3rem;
  /* Adjust input width as necessary */
}
</style>