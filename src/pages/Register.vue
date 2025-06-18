<script setup lang="ts">
import {FormCheck, FormInput, FormLabel, FormSelect} from "@/components/Base/Form";
import Button from "@/components/Base/Button";
import {ref, computed, onMounted, watch} from 'vue';
import {register} from "@/services/authService";
import {VueTelInput} from 'vue3-tel-input'
import 'vue3-tel-input/dist/vue3-tel-input.css'
import Lucide from "@/components/Base/Lucide";
import VueTurnstile from "vue-turnstile";
import {RouterLink, useRouter} from "vue-router";
import GradientButton from "@/components/Commons/GradientButton.vue";

import logoLight from '/logo_wide.svg'

const siteKey = '0x4AAAAAABhCqehMDjoBonC9';
const turnstile_token = ref('');
const projectName = import.meta.env.VITE_PROJECT_NAME;
const projectlabel = import.meta.env.VITE_PROJECT_LABEL;
const router = useRouter();

const phone = ref("");
const theme = ref("dark");
const apiError = ref('');
const fname = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const promoCode = ref("");
const selectedCountry = ref("");

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
const promocodeDisable = ref(false)
const errors = ref({
  fname: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  agree: "",
  country: "",
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

// DARK MODE
const isDark = ref(true);

function toggleDark() {
  isDark.value = !isDark.value
  if(theme.value == "dark"){
    theme.value = "light"
  }else if(theme.value == "light"){
    theme.value = "dark"
  }
}

watch(isDark, (val) => {
  const html = document.documentElement
  html.classList.toggle('dark', val)
}, {immediate: true})

onMounted(() => {
  const url = new URL(window.location.href);
  const promo = url.searchParams.get('promo');
  if (promo) {
    promocodeDisable.value = true
    promoCode.value = promo;
  }
  // Ensure dark mode ON by default
  document.documentElement.classList.add('dark');
});

const updatePhone = (event: any) => {
  if (typeof event === 'string') phone.value = event;
  else if (event && event.target && typeof event.target.value === 'string') phone.value = event.target.value;
  else phone.value = "";
};

const conditions = ref([
  {valid: false, message: "Minimum 8 characters", regex: /.{8,}/},
  {valid: false, message: "At least 1 uppercase letter", regex: /[A-Z]/},
  {valid: false, message: "At least 1 lowercase letter", regex: /[a-z]/},
  {valid: false, message: "At least 1 special character", regex: /[@$!%*#?&]/},
  {valid: false, message: "At least 1 digit", regex: /[0-9]/},
]);
const validatePasswordConditions = () => {
  conditions.value.forEach(condition => {
    condition.valid = condition.regex.test(password.value);
  });
};
watch(password, () => {
  validatePasswordConditions();
});

const passwordStrength = computed(() => {
  let strength = 0;
  conditions.forEach(condition => {
    condition.valid = condition.regex.test(password.value);
    if (condition.valid) strength += 1;
  });
  return strength;
});

const validateFields = () => {
  let valid = true;
  if (!fname.value) {
    errors.value.fname = "Full name is required";
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
  } else if (!/^\+?\d{8,15}$/.test(phone.value.replace(/\s/g, ''))) {
    errors.value.phone = "Please enter a valid phone number";
    valid = false;
  } else {
    errors.value.phone = "";
  }
  if (!password.value) {
    errors.value.password = "Password is required";
    valid = false;
  } else if (conditions.value.some(condition => !condition.valid)) {
    errors.value.password = "Password doesn't meet requirements";
    valid = false;
  } else {
    errors.value.password = "";
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
const filterNumbers = (phoneNumber, {number, isValid}) => {
  phone.value = phoneNumber.replace(/[^\d+]/g, '');
};
const registerUser = async () => {
  isLoading.value = true;
  apiError.value = '';
  if (!validateFields()) {
    isLoading.value = false;
    return;
  }
  if (!turnstile_token.value) {
    alert('Please complete the CAPTCHA!');
    isLoading.value = false;
    return;
  }
  try {
    const userData = {
      fname: fname.value,
      email_id: email.value,
      password: password.value,
      phone_number: phone.value,
      nationality: selectedCountry.value,
      client_entity: 1,
      is_email_verified: false,
      is_corporate: false,
      referal_code: promoCode.value,
      turnstile_token: turnstile_token.value,
    };
    const response = await register(userData);
    if (response.data?.status === false) {
      apiError.value = response.data.message;
      return;
    }
    router.push("/verify-email");
  } catch (error) {
    if (error.response?.data?.status === false) {
      apiError.value = error.response.data.message;
      if (error.response.data.message.includes('email')) {
        errors.value.email = error.response.data.message;
      }
    } else {
      apiError.value = error.response?.data?.message || "Registration failed. Please try again.";
    }
  } finally {
    isLoading.value = false;
  }
};
const navigateToLogin = () => {
  router.push('/login');
};
</script>

<template>
  <section
      class="relative bg-gray-50 dark:bg-stone-950 min-h-screen flex items-center justify-center"
  >
    <!-- Dark/Light Mode Toggle -->
    <button
        @click="toggleDark"
        class="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none"
    >
      <span v-if="isDark" class="text-yellow-300">☀️</span>
      <span v-else class="text-gray-800">🌙</span>
    </button>

    <div class="bg-gray-100 dark:bg-custom-gradient-dark flex rounded-2xl shadow-lg max-w-3xl p-5 items-center w-full">
      <!-- Form section -->
      <div class="md:w-full px-4 w-full">
        <RouterLink to="/" class="flex justify-center mb-6">
          <img :src="logoLight" class="w-64 content-center"/>
        </RouterLink>
        <h2 class="font-bold text-2xl text-[#002D74] dark:text-gray-200 pt-2">Sign Up</h2>
        <p class="text-xs mt-2 text-[#002D74] dark:text-gray-400">
          Already have an account?
          <a class="font-medium text-[#b67b2f] dark:text-yellow-400" href="/login">Sign In</a>
        </p>
        <!-- Form Fields -->
        <form @submit.prevent="registerUser" class="flex flex-col gap-4 mt-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormLabel>Full Name*</FormLabel>
              <FormInput v-model="fname" type="text" placeholder="John Doe"
                         class="p-2 rounded-xl border w-full text-base bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100"/>
              <div v-if="errors.fname" class="text-red-500 text-xs mt-1">{{ errors.fname }}</div>
            </div>
            <div>
              <FormLabel>Email*</FormLabel>
              <FormInput v-model="email" type="text" :placeholder="'clientemail@' + projectlabel + '.com'"
                         class="p-2 text-base rounded-xl border w-full bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100"/>
              <div v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormLabel>Nationality*</FormLabel>
              <FormSelect v-model="selectedCountry"
                          class="p-2 rounded-xl border w-full text-base bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                <option value="" disabled>Select a country</option>
                <option v-for="country in countries" :key="country.id" :value="country.id">
                  {{ country.name }}
                </option>
              </FormSelect>
              <div v-if="errors.country" class="text-red-500 text-xs mt-1">{{ errors.country }}</div>
            </div>
            <div>
              <FormLabel>Phone Number*</FormLabel>
              <vue-tel-input style="border: 0px;"
                  v-model="phone"
                  mode="international"
                  class="custom-phone-input text-base"
                  :inputOptions="{
                    placeholder: 'Enter phone number',
                    styleClasses: 'phone-input-inner',
                    type: 'tel'
                  }"
                  @input="filterNumbers"
              ></vue-tel-input>
              <div v-if="errors.phone" class="text-red-500 text-xs mt-1">{{ errors.phone }}</div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormLabel>Password*</FormLabel>
              <div class="relative">
                <FormInput
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="************"
                    class="p-2 rounded-xl text-base border w-full bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                />
                <button type="button" @click="togglePasswordVisibility"
                        class="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Lucide :icon="showPassword ? 'EyeOff' : 'Eye'" class="w-5 h-5 text-gray-400"/>
                </button>
              </div>
              <div v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</div>
              <div v-if="password" class="flex flex-col space-y-1 mt-2 text-xs">
                <div v-for="(condition, index) in conditions" :key="index" class="flex items-center">
                  <Lucide
                      :icon="condition.valid ? 'CheckCircle' : 'XCircle'"
                      :class="condition.valid ? 'text-green-400' : 'text-red-400'"
                      class="w-4 h-4 mr-2"
                  />
                  <span :class="condition.valid ? 'text-green-400' : 'text-red-400'">{{ condition.message }}</span>
                </div>
              </div>
            </div>
            <div>
              <FormLabel>Confirm Password*</FormLabel>
              <div class="relative">
                <FormInput
                    v-model="confirmPassword"
                    :type="showPassword2 ? 'text' : 'password'"
                    placeholder="************"
                    class="p-2 rounded-xl text-base border w-full bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                />
                <button type="button" @click="togglePasswordVisibility2"
                        class="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Lucide :icon="showPassword2 ? 'EyeOff' : 'Eye'" class="w-5 h-5 text-gray-400"/>
                </button>
              </div>
              <div v-if="errors.confirmPassword" class="text-red-500 text-xs mt-1">{{ errors.confirmPassword }}</div>
              <div v-if="confirmPassword" class="text-xs mt-1">
                <span v-if="confirmPassword === password" class="text-green-400">Passwords match ✅</span>
                <span v-else class="text-red-400">Passwords do not match ❌</span>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FormLabel>Referral Code (if any)</FormLabel>
              <FormInput
                  v-model="promoCode"
                  type="text"
                  placeholder="Referral Code"
                  class="p-2 rounded-xl border w-full text-base bg-white dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  :disabled="promocodeDisable"
              />
            </div>
            <div>
              <vue-turnstile
                  class="w-full md:mt-2"
                  theme="dark"
                  :site-key="siteKey"
                  v-model="turnstile_token"
              />
            </div>
          </div>
          <div class="flex items-start sm:items-center gap-2 flex-nowrap mt-2">
            <FormCheck.Input
                id="remember-me"
                v-model="isAgreeChecked"
                type="checkbox"
                class="mt-1 sm:mt-0 flex-shrink-0 border-2 border-cyan-100"
            />
            <label
                for="remember-me"
                class="cursor-pointer select-none leading-snug flex-1 text-[13px] sm:text-sm text-gray-600 dark:text-gray-300"
            >
              I agree to the {{ projectName }}
              <a class="ml-1 text-[#b67b2f] dark:text-yellow-400 underline" href=""
                 target="_blank">Privacy Policy</a>,
              <a class="ml-1 text-[#b67b2f] dark:text-yellow-400 underline"
                 href="" target="_blank">Terms and Conditions</a>,
              and
              <a class="ml-1 text-[#b67b2f] dark:text-yellow-400 underline" href=""
                 target="_blank">Risk Disclosure</a>.
            </label>
          </div>
          <div v-if="errors.agree" class="text-red-500 text-xs mt-1">{{ errors.agree }}</div>
          <!-- Action Buttons -->
          <button
              type="submit"
              :disabled="isLoading"
              class="bg-gradient-to-r from-[#c59d4c] to-[#b67b2f] text-white dark:text-black font-semibold rounded-xl px-6 py-2 shadow-md border border-[#a67c2d] hover:brightness-110 hover:scale-105 transition duration-300 flex items-center justify-center mt-4"
          >
            <span v-if="!isLoading">SIGN UP</span>
            <span v-else>
    <svg class="animate-spin h-5 w-5 mr-2 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
    </svg>
    SIGNING UP...
  </span>
          </button>

          <Button
              rounded
              class="flex-1 border-2 rounded-[50px] dark:border-slate-500 relative border-slate-200/80 w-full mt-4"
              @click="navigateToLogin"
          >BACK TO LOGIN
          </Button>
          <div v-if="apiError" class="mt-4 text-center">
            <div class="text-red-500 text-sm p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              {{ apiError }}
            </div>
          </div>
        </form>
        <div class="mt-5 text-justify text-[10px] sm:text-xs text-gray-400 dark:text-gray-400 leading-relaxed">
          <p>
            Forex and Leveraged Financial Instruments involve significant risk and can result in the loss of your
            invested capital. You should not invest more than you can afford to lose and should ensure that you fully
            understand the risks involved.
            Trading leveraged products may not be suitable for all investors. Past performance is no guarantee of future
            results.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bg-custom-gradient-dark {
  background: linear-gradient(135deg, #18181b 60%, #b67b2f 180%);
}

/* Match all styles for custom-phone-input with other fields */
.custom-phone-input :deep(.vti__input) {
  background-color: #fff; /* Light mode default */
  color: #1a202c;
  border-top-right-radius: 0.75rem;
  border-bottom-right-radius: 0.75rem;
  border-width: 1px;
  border-style: solid;
  border-color: #e5e7eb; /* Tailwind border-gray-200 */
  font-size: 1rem;
  height: 44px;
  font-weight: 500;
  padding: 0.5rem 0.75rem;
  outline: none;
  box-shadow: none;
  transition: border-color 0.2s;
}
.dark .custom-phone-input :deep(.vti__input) {
  background-color: #374151 !important; /* dark:bg-gray-700 */
  color: #f3f4f6 !important;           /* dark:text-gray-100 */
  border-color: #4b5563 !important;    /* dark:border-gray-600 */
}
.custom-phone-input :deep(.vti__input:focus) {
  border-color: #b67b2f;
  box-shadow: 0 0 0 2px #f5e6d5;
}
.dark .custom-phone-input :deep(.vti__input:focus) {
  border-color: #b67b2f !important;
  box-shadow: 0 0 0 2px #322512;
}

.custom-phone-input :deep(.vti__dropdown) {
  background-color: #fff;
  color: #1a202c;
  border-top-left-radius: 0.75rem;
  border-bottom-left-radius: 0.75rem;
  border-color: #e5e7eb;
  border-width: 1px;
  border-style: solid;
  height: 44px;
}
.dark .custom-phone-input :deep(.vti__dropdown) {
  background-color: #374151 !important;
  color: #f3f4f6 !important;
  border-color: #4b5563 !important;
}

.custom-phone-input :deep(.vti__dropdown-list) {
  background-color: #fff;
  color: #1a202c;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 12px rgba(0,0,0,.08);
}
.dark .custom-phone-input :deep(.vti__dropdown-list) {
  background-color: #374151 !important;
  color: #f3f4f6 !important;
  border-color: #4b5563 !important;
}

.custom-phone-input :deep(.vti__dropdown-item) {
  color: #1a202c;
  font-size: 1rem;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
}
.dark .custom-phone-input :deep(.vti__dropdown-item) {
  color: #f3f4f6 !important;
}
.custom-phone-input :deep(.vti__dropdown-item--highlighted),
.custom-phone-input :deep(.vti__dropdown-item:hover) {
  background: #f5e6d5;
  color: #b67b2f;
}
.dark .custom-phone-input :deep(.vti__dropdown-item--highlighted),
.dark .custom-phone-input :deep(.vti__dropdown-item:hover) {
  background: #b67b2f !important;
  color: #18181b !important;
}

.custom-phone-input :deep(.vti__flag) {
  border-radius: 0.25rem;
}

</style>


<!--
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
]);-->
