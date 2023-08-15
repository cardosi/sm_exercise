from decimal import Decimal
import os
import boto3
import traceback
import logging
from boto3.dynamodb.conditions import Attr
from typing import List, Dict, Any
from botocore.exceptions import BotoCoreError, ClientError

# Configure logging
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)


class DynamoDBClient:
    def __init__(self, table_name: str):
        self.env: str = os.getenv('ENV', 'dev')
        try:
            if self.env == 'PROD':
                self.dynamodb = boto3.resource(
                    'dynamodb', region_name='us-west-2')
            else:
                self.dynamodb = boto3.resource(
                    'dynamodb', endpoint_url='http://localhost:8000')
            self.table = self.dynamodb.Table(table_name)
        except (BotoCoreError, ClientError) as e:
            logger.error("Error initializing DynamoDB client:")
            logger.error(str(e))
            logger.error(traceback.format_exc())
        except Exception as e:
            logger.error("Unexpected error during initialization:")
            logger.error(str(e))
            logger.error(traceback.format_exc())

    def get_all_items(self) -> List[Dict[str, Any]]:
        try:
            response = self.table.scan()
            items = response.get('Items', [])
            return items
        except (BotoCoreError, ClientError) as e:
            logger.error("Error getting all items:")
            logger.error(str(e))
            logger.error(traceback.format_exc())
        except Exception as e:
            logger.error("Unexpected error during getting all items:")
            logger.error(str(e))
            logger.error(traceback.format_exc())

    def get_item(self, key: Dict[str, Any]) -> Dict[str, Any]:
        try:
            response = self.table.get_item(Key=key)
            item = response.get('Item', None)
            return item
        except (BotoCoreError, ClientError) as e:
            logger.error("Error getting item:")
            logger.error(str(e))
            logger.error(traceback.format_exc())
        except Exception as e:
            logger.error("Unexpected error during getting item:")
            logger.error(str(e))
            logger.error(traceback.format_exc())

    def create_item(self, item: Dict[str, Any]):
        try:
            self.table.put_item(Item=item)
        except (BotoCoreError, ClientError) as e:
            logger.error("Error creating item:")
            logger.error(str(e))
            logger.error(traceback.format_exc())
        except Exception as e:
            logger.error("Unexpected error during item creation:")
            logger.error(str(e))
            logger.error(traceback.format_exc())

    def update_item(self, item: Dict[str, Any]):
        try:
            self.table.put_item(Item=item)
        except (BotoCoreError, ClientError) as e:
            logger.error("Error updating item:")
            logger.error(str(e))
            logger.error(traceback.format_exc())
        except Exception as e:
            logger.error("Unexpected error during item update:")
            logger.error(str(e))
            logger.error(traceback.format_exc())

    def delete_item(self, key: Dict[str, Any]):
        try:
            self.table.delete_item(Key=key)
        except (BotoCoreError, ClientError) as e:
            logger.error("Error deleting item:")
            logger.error(str(e))
            logger.error(traceback.format_exc())
        except Exception as e:
            logger.error("Unexpected error during item deletion:")
            logger.error(str(e))
            logger.error(traceback.format_exc())

    def batch_delete_items(self, keys: List[Any]):
        try:
            with self.table.batch_writer() as batch:
                for key in keys:
                    batch.delete_item(Key={'id': Decimal(str(key))})
        except (BotoCoreError, ClientError) as e:
            logger.error("Error in batch delete items:")
            logger.error(str(e))
            logger.error(traceback.format_exc())
        except Exception as e:
            logger.error("Unexpected error during batch delete items:")
            logger.error(str(e))
            logger.error(traceback.format_exc())
